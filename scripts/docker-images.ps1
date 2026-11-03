param([Parameter(Mandatory=$true)][string]$DockerHubUser,[string]$Tag='v1',[switch]$Push)
$ErrorActionPreference='Stop'
if($DockerHubUser -notmatch '^[a-z0-9][a-z0-9_-]+$' -or $Tag -notmatch '^[A-Za-z0-9_.-]+$'){throw 'Invalid registry name/tag'}
$projects=@{'bff'='fuelwise-bff';'mongo-service'='fuelwise-microservice-mongo';'sql-service'='fuelwise-microservice-sql'}
foreach($name in $projects.Keys){
  $image="${DockerHubUser}/fuelwise-${name}:${Tag}"
  docker build -t $image "projects/$($projects[$name])"
  if($LASTEXITCODE -ne 0){throw "Build failed: $image"}
  if($Push){docker push $image;if($LASTEXITCODE -ne 0){throw "Push failed: $image"}}
}
