param([string]$Destination='tmp/export')
$ErrorActionPreference='Stop'
# Explicit file allowlist excludes node_modules, env files, credentials and build output.
$names=@('fuelwise-frontend','fuelwise-bff','fuelwise-microservice-mongo','fuelwise-microservice-sql','fuelwise-azure-function')
foreach($name in $names){
  $files=git ls-files "projects/$name"
  foreach($file in $files){$relative=$file.Substring("projects/$name/".Length);$target=Join-Path (Join-Path $Destination $name) $relative;New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null;Copy-Item -LiteralPath $file -Destination $target}
}
Write-Output 'Projects exported; no remote repository created or pushed.'
