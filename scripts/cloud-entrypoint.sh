#!/bin/sh
# Starts an ephemeral PostgreSQL bound to 127.0.0.1, migrates, seeds the admin and runs the API as "node".
set -eu
: "${LEGACY_DB_PASSWORD:?LEGACY_DB_PASSWORD required}"
PGDATA=/var/lib/postgresql/data
# Hosts such as Azure Container Apps mount an empty /run: recreate the socket/lock directory.
mkdir -p /run/postgresql && chown postgres:postgres /run/postgresql
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  printf '%s' "$LEGACY_DB_PASSWORD" > /tmp/pgpw && chown postgres /tmp/pgpw
  su-exec postgres initdb -D "$PGDATA" -U fuelwise --auth=scram-sha-256 --set dynamic_shared_memory_type=mmap --pwfile=/tmp/pgpw >/tmp/initdb.log 2>&1 || { cat /tmp/initdb.log >&2; exit 1; }
  rm -f /tmp/pgpw
fi
# mmap: sandboxed hosts (Azure Container Apps) may refuse POSIX shared memory.
PGOPTS="-c listen_addresses=127.0.0.1 -c dynamic_shared_memory_type=mmap -c shared_buffers=32MB -c max_connections=30"
su-exec postgres pg_ctl -D "$PGDATA" -o "$PGOPTS" -l /tmp/postgres.log -w start >/dev/null || { cat /tmp/postgres.log >&2; exit 1; }
export PGPASSWORD="$LEGACY_DB_PASSWORD"
psql -h 127.0.0.1 -U fuelwise -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='fuelwise'" | grep -q 1 \
  || createdb -h 127.0.0.1 -U fuelwise fuelwise
unset PGPASSWORD
export DATABASE_URL="postgresql://fuelwise:${LEGACY_DB_PASSWORD}@127.0.0.1:5432/fuelwise"
unset LEGACY_DB_PASSWORD
su-exec node npm run -s db:migrate
su-exec node npm run -s db:seed:admin
exec su-exec node node src/server.js
