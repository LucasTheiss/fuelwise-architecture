#!/usr/bin/env bash
# Publishes FuelWise Delivery 3 on Azure free offers only:
#   - Azure Container Apps (Consumption, scale-to-zero, no Log Analytics) for legacy+Postgres sidecar,
#     stations (Mongo Atlas), trips (Azure SQL fuelwiseDB), Azure Functions host, BFF and gateway;
#   - the microfrontend (nginx) in the same environment. Static Web Apps is not offered in the regions the
#     Azure for Students policy allows (brazilsouth, chilecentral, canadacentral, mexicocentral, northcentralus).
# Idempotent: rerun to update. Secrets come from the ignored .env.cloud; generated ones are appended there.
# Usage (Git Bash): bash scripts/deploy-azure.sh [all|frontend|firewall|urls]
set -euo pipefail
cd "$(dirname "$0")/.."

AZ=${AZ:-az}
command -v "$AZ" >/dev/null 2>&1 || AZ="/c/Program Files/Microsoft SDKs/Azure/CLI2/wbin/az.cmd"
RG=${RG:-Fuelwise}
LOC=${LOC:-brazilsouth}
ENV_NAME=${ENV_NAME:-fuelwise-env}
SQL_SERVER_NAME=${SQL_SERVER_NAME:-fuelwise}
TAG=${TAG:-v1}
STEP=${1:-all}
WORK=tmp/azure-deploy
mkdir -p "$WORK"
trap 'rm -f "$WORK"/*.yaml' EXIT       # YAML files carry secrets; never keep them.

# Read KEY=VALUE without shell evaluation (values contain & ! ?).
[ -f .env.cloud ] || { echo "Missing .env.cloud" >&2; exit 1; }
while IFS= read -r line || [ -n "$line" ]; do
  line=${line%$'\r'}
  [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || { [ -z "$line" ] || [[ "$line" == \#* ]] || echo "Ignoring invalid line in .env.cloud" >&2; continue; }
  export "${line%%=*}=${line#*=}"
done < .env.cloud
for key in MONGODB_URI AZURE_SQL_SERVER AZURE_SQL_DATABASE AZURE_SQL_USER AZURE_SQL_PASSWORD DOCKERHUB_USER; do
  [ -n "${!key:-}" ] || { echo "Set $key in .env.cloud" >&2; exit 1; }
done

gen() { openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c "$1"; }
ensure() { # ensure KEY VALUE: persist generated secret once
  if [ -z "${!1:-}" ]; then printf '%s=%s\n' "$1" "$2" >> .env.cloud; export "$1=$2"; fi
}
ensure JWT_SECRET "$(gen 48)"
ensure LEGACY_DB_PASSWORD "$(gen 32)"
ensure ADMIN_EMAIL "admin@fuelwise.app"
ensure ADMIN_PASSWORD "Fw!$(gen 20)"
ensure FUNCTION_KEY "$(gen 40)"
ensure FUNCTION_MASTER_KEY "$(gen 40)"

# The network used during setup resets some TLS connections; retry read/idempotent calls.
az_retry() { local i; for i in 1 2 3 4 5 6; do "$AZ" "$@" && return 0; echo "az retry $i..." >&2; sleep 4; done; return 1; }
"$AZ" config set extension.use_dynamic_install=yes_without_prompt core.only_show_errors=true >/dev/null

yaml_quote() { printf "'%s'" "${1//\'/\'\'}"; }

ensure_env() {
  if ! "$AZ" containerapp env show -n "$ENV_NAME" -g "$RG" >/dev/null 2>&1; then
    az_retry containerapp env create -n "$ENV_NAME" -g "$RG" -l "$LOC" --logs-destination none >/dev/null
  fi
  ENV_ID=$(az_retry containerapp env show -n "$ENV_NAME" -g "$RG" --query id -o tsv | tr -d '\r')
  DOMAIN=$(az_retry containerapp env show -n "$ENV_NAME" -g "$RG" --query properties.defaultDomain -o tsv | tr -d '\r')
  LEGACY_URL="https://legacy.$DOMAIN"
  STATIONS_URL="https://stations.$DOMAIN"
  TRIPS_URL="https://trips.$DOMAIN"
  FUNCTION_BASE="https://function.$DOMAIN"
  BFF_URL="https://bff.$DOMAIN"   # internal ingress; express environments keep the plain FQDN
  GATEWAY_URL="https://gateway.$DOMAIN"
  FRONTEND_ORIGIN="https://frontend.$DOMAIN"
}

# deploy_app NAME YAML_FILE: create, or update in place when it exists.
deploy_app() {
  if "$AZ" containerapp show -n "$1" -g "$RG" >/dev/null 2>&1; then
    az_retry containerapp update -n "$1" -g "$RG" --yaml "$2" >/dev/null
  else
    az_retry containerapp create -n "$1" -g "$RG" --yaml "$2" >/dev/null
  fi
  echo "deployed $1"
}

# header NAME EXTERNAL PORT: common part of every app definition.
header() {
  cat <<EOF
location: $LOC
properties:
  managedEnvironmentId: $ENV_ID
  configuration:
    activeRevisionsMode: Single
    ingress:
      external: $2
      targetPort: $3
      transport: auto
      allowInsecure: false
EOF
}
scale() { # scale COOLDOWN_SECONDS
  cat <<EOF
    scale:
      minReplicas: 0
      maxReplicas: 1
      cooldownPeriod: $1
      rules:
        - name: http
          http:
            metadata:
              concurrentRequests: '20'
EOF
}
probe() { # probe PORT PATH
  cat <<EOF
        probes:
          - type: Startup
            httpGet: {path: $2, port: $1}
            periodSeconds: 10
            failureThreshold: 10
          - type: Liveness
            httpGet: {path: /health/live, port: $1}
            periodSeconds: 30
EOF
}
# Pin by the digest Docker Hub currently serves for the tag: Container Apps caches images by tag,
# so a re-pushed tag would otherwise keep running the old content.
img() {
  local digest
  digest=$(curl -fsS "https://hub.docker.com/v2/repositories/$DOCKERHUB_USER/$1/tags/$TAG" \
    | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>process.stdout.write(JSON.parse(s).digest||''))")
  [ -n "$digest" ] || { echo "No $DOCKERHUB_USER/$1:$TAG on Docker Hub" >&2; exit 1; }
  echo "docker.io/$DOCKERHUB_USER/$1@$digest"
}

deploy_legacy() {
  local f="$WORK/legacy.yaml"
  { header legacy true 3000
    cat <<EOF
    secrets:
      - {name: legacy-db-password, value: $(yaml_quote "$LEGACY_DB_PASSWORD")}
      - {name: jwt-secret, value: $(yaml_quote "$JWT_SECRET")}
      - {name: admin-password, value: $(yaml_quote "$ADMIN_PASSWORD")}
  template:
    containers:
      # Dockerfile.cloud: API + ephemeral PostgreSQL on 127.0.0.1 (express environments reject sidecars).
      - name: legacy
        image: $(img fuelwise-legacy-cloud)
        resources: {cpu: 0.5, memory: 1Gi}
        env:
          - {name: LEGACY_DB_PASSWORD, secretRef: legacy-db-password}
          - {name: JWT_SECRET, secretRef: jwt-secret}
          - {name: ADMIN_EMAIL, value: $(yaml_quote "$ADMIN_EMAIL")}
          - {name: ADMIN_PASSWORD, secretRef: admin-password}
          - {name: INTEGRATION_MODE, value: mock}
          - {name: DOMAIN_MODE, value: distributed}
          - {name: STATIONS_SERVICE_URL, value: $STATIONS_URL}
          - {name: TRIPS_SERVICE_URL, value: $TRIPS_URL}
          - {name: CORS_ORIGIN, value: $FRONTEND_ORIGIN}
EOF
    probe 3000 /health/ready
    scale 1800   # 30 min idle before scale-to-zero (which resets the demo database).
  } > "$f"
  deploy_app legacy "$f"
}

deploy_stations() {
  local f="$WORK/stations.yaml"
  { header stations true 3001
    cat <<EOF
    secrets:
      - {name: mongodb-uri, value: $(yaml_quote "$MONGODB_URI")}
  template:
    containers:
      - name: stations
        image: $(img fuelwise-mongo-service)
        # Logs the egress IP (express environments rotate it) so it can be added to the Atlas allowlist.
        command: [sh, -c, "echo egress-ip=\$(wget -qO- -T 5 https://api.ipify.org || echo unknown); exec node src/server.js"]
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: MONGODB_URI, secretRef: mongodb-uri}
          - {name: MONGODB_DATABASE, value: ${MONGODB_DATABASE:-fuelwise_stations}}
          - {name: LEGACY_URL, value: $LEGACY_URL}
EOF
    probe 3001 /health/live
    scale 300
  } > "$f"
  deploy_app stations "$f"
}

deploy_trips() {
  local f="$WORK/trips.yaml"
  { header trips true 3002
    cat <<EOF
    secrets:
      - {name: sql-password, value: $(yaml_quote "$AZURE_SQL_PASSWORD")}
  template:
    containers:
      - name: trips
        image: $(img fuelwise-sql-service)
        # Idempotent schema migration; retries while the serverless database resumes from AutoPause.
        command: [sh, -c, "echo egress-ip=\$(wget -qO- -T 5 https://api.ipify.org || echo unknown); until npm run -s db:migrate; do sleep 10; done && exec node src/server.js"]
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: AZURE_SQL_SERVER, value: $AZURE_SQL_SERVER}
          - {name: AZURE_SQL_DATABASE, value: $AZURE_SQL_DATABASE}
          - {name: AZURE_SQL_USER, value: $(yaml_quote "$AZURE_SQL_USER")}
          - {name: AZURE_SQL_PASSWORD, secretRef: sql-password}
          - {name: AZURE_SQL_PORT, value: '1433'}
          - {name: SQL_LOCAL_DEVELOPMENT, value: 'false'}
          - {name: LEGACY_URL, value: $LEGACY_URL}
EOF
    probe 3002 /health/live
    scale 300
  } > "$f"
  deploy_app trips "$f"
}

deploy_function() {
  local f="$WORK/function.yaml" keys
  keys="{\"masterKey\":{\"name\":\"master\",\"value\":\"$FUNCTION_MASTER_KEY\",\"encrypted\":false},\"functionKeys\":[{\"name\":\"default\",\"value\":\"$FUNCTION_KEY\",\"encrypted\":false}],\"systemKeys\":[]}"
  { header function true 80
    cat <<EOF
    secrets:
      - {name: host-keys, value: $(yaml_quote "$keys")}
  template:
    containers:
      - name: function
        image: $(img fuelwise-function)
        # HTTP-only app: host keys written to a local file at startup, no Storage Account (keeps it free).
        # Express environments reject secret volumes, so the keys arrive as a secret env var.
        command: [sh, -c, "mkdir -p /home/site/secrets && printf '%s' \"\$FUNCTION_HOST_KEYS\" > /home/site/secrets/host.json && unset FUNCTION_HOST_KEYS && exec /opt/startup/start_nonappservice.sh"]
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: AzureWebJobsSecretStorageType, value: files}
          - {name: FUNCTIONS_SECRETS_PATH, value: /home/site/secrets}
          - {name: FUNCTION_HOST_KEYS, secretRef: host-keys}
EOF
    scale 300
  } > "$f"
  deploy_app function "$f"
}

deploy_bff() {
  local f="$WORK/bff.yaml"
  { header bff false 3003
    cat <<EOF
    secrets:
      - {name: function-key, value: $(yaml_quote "$FUNCTION_KEY")}
  template:
    containers:
      - name: bff
        image: $(img fuelwise-bff)
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: LEGACY_URL, value: $LEGACY_URL}
          - {name: STATIONS_URL, value: $STATIONS_URL}
          - {name: TRIPS_URL, value: $TRIPS_URL}
          - {name: FUNCTION_URL, value: $FUNCTION_BASE/api/indicators}
          - {name: FUNCTION_KEY, secretRef: function-key}
          - {name: HTTP_TIMEOUT_MS, value: '10000'}
EOF
    probe 3003 /health/live
    scale 300
  } > "$f"
  deploy_app bff "$f"
}

deploy_gateway() {
  local f="$WORK/gateway.yaml"
  { header gateway true 8080
    cat <<EOF
  template:
    containers:
      - name: gateway
        image: $(img fuelwise-gateway)
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: BFF_URL, value: $BFF_URL}
          - {name: CORS_ORIGIN, value: $FRONTEND_ORIGIN}
          - {name: NODE_ENV, value: production}
          - {name: TLS_TERMINATED_UPSTREAM, value: 'true'}
          - {name: TRUST_PROXY_HOPS, value: '1'}
EOF
    probe 8080 /health/live
    scale 300
  } > "$f"
  deploy_app gateway "$f"
}

# Azure SQL: allow only the Container Apps outbound IPs (never 0.0.0.0-255.255.255.255).
# Express environments publish no fixed egress IPs: nothing is opened automatically; add each observed
# IP as a /32 rule (see docs/DEPLOYMENT.md, "Operação").
open_sql_firewall() {
  local ips i=0 ip
  ips=$(az_retry containerapp show -n stations -g "$RG" --query "properties.outboundIpAddresses" -o tsv | tr -d '\r' | tr ',\t' '\n\n' | sort -u)
  if [ -z "$ips" ]; then
    echo "No published egress IPs (express environment). Add observed IPs as /32 rules manually." >&2
    return
  fi
  for ip in $ips; do
    i=$((i+1))
    az_retry sql server firewall-rule create -g "$RG" -s "$SQL_SERVER_NAME" -n "aca-outbound-$i" --start-ip-address "$ip" --end-ip-address "$ip" >/dev/null
  done
  printf '%s\n' $ips > "$WORK/outbound-ips.txt"
  echo "Container Apps outbound IPs (add each to MongoDB Atlas > Network Access):"; cat "$WORK/outbound-ips.txt"
}

deploy_frontend() {
  local f="$WORK/frontend.yaml"
  { header frontend true 80
    cat <<EOF
  template:
    containers:
      - name: frontend
        image: $(img fuelwise-frontend)
        # Runtime configuration only (no secrets): point the shell at the public gateway, then serve.
        command: [sh, -c, "echo \"window.FUELWISE_CONFIG={gatewayUrl:'\$GATEWAY_URL',stationsModule:'/modules/stations/remote.js',tripsModule:'/modules/trips/remote.js'};\" > /usr/share/nginx/html/runtime-config.js && exec nginx -g 'daemon off;'"]
        resources: {cpu: 0.25, memory: 0.5Gi}
        env:
          - {name: GATEWAY_URL, value: $GATEWAY_URL}
EOF
    scale 300
  } > "$f"
  deploy_app frontend "$f"
}

print_urls() {
  cat > tmp/cloud-urls.json <<EOF
{"frontend":"$FRONTEND_ORIGIN","gateway":"$GATEWAY_URL","bffSwagger":"$GATEWAY_URL/docs","stationsSwagger":"$STATIONS_URL/docs","tripsSwagger":"$TRIPS_URL/docs","function":"$FUNCTION_BASE/api/indicators","legacy":"$LEGACY_URL"}
EOF
  cat tmp/cloud-urls.json
}

ensure_env
case "$STEP" in
  firewall) open_sql_firewall ;;
  frontend) deploy_frontend ;;
  urls) ;;
  stations|legacy|trips|function|bff|gateway) "deploy_$STEP" ;;
  all)
    deploy_stations
    open_sql_firewall
    deploy_legacy
    deploy_trips
    deploy_function
    deploy_bff
    deploy_gateway
    deploy_frontend ;;
  *) echo "unknown step $STEP" >&2; exit 2 ;;
esac
print_urls
