import {spawnSync} from 'node:child_process';
const npm=process.platform==='win32'?'npm.cmd':'npm';
for(const cwd of ['.','projects/fuelwise-microservice-mongo','projects/fuelwise-microservice-sql','projects/fuelwise-bff','projects/fuelwise-azure-function','projects/fuelwise-frontend','infrastructure/gateway']){
  const result=spawnSync(npm,['test'],{cwd,stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)process.exit(result.status||1);
}
