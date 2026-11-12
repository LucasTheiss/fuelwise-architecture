param([Parameter(Mandatory=$true)][string]$DockerHubUser,[string]$Tag='v1',[switch]$Push,[string[]]$Only)
# Continue: Windows PowerShell 5.1 turns docker's progress on stderr into errors; exit codes are checked below.
$ErrorActionPreference='Continue'
if($DockerHubUser -notmatch '^[a-z0-9][a-z0-9_-]+$' -or $Tag -notmatch '^[A-Za-z0-9_.-]+$'){throw 'Invalid registry name/tag'}
# name = context|dockerfile. Function uses the official Azure Functions host image (Dockerfile.runtime).
$projects=[ordered]@{
  'bff'='projects/fuelwise-bff|Dockerfile'
  'mongo-service'='projects/fuelwise-microservice-mongo|Dockerfile'
  'sql-service'='projects/fuelwise-microservice-sql|Dockerfile'
  'gateway'='infrastructure/gateway|Dockerfile'
  'legacy'='.|Dockerfile'
  'function'='projects/fuelwise-azure-function|Dockerfile.runtime'
  'frontend'='projects/fuelwise-frontend|Dockerfile'
  'legacy-cloud'='.|Dockerfile.cloud'
}
foreach($name in $projects.Keys){
  if($Only -and $Only -notcontains $name){continue}
  $context,$file=$projects[$name].Split('|')
  $image="${DockerHubUser}/fuelwise-${name}:${Tag}"
  docker build -t $image -f "$context/$file" $context
  if($LASTEXITCODE -ne 0){throw "Build failed: $image"}
  if($Push){docker push $image;if($LASTEXITCODE -ne 0){throw "Push failed: $image"}}
}
