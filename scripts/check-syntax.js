import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
let count=0,failures=0;
async function walk(dir) {
  for(const item of await readdir(dir,{withFileTypes:true})) {
    const filename=join(dir,item.name);
    if (item.isDirectory() && !['node_modules','dist'].includes(item.name)) await walk(filename);
    else if (/\.m?js$/.test(item.name)) {
      count++;
      const p=spawnSync(process.execPath,['--check',filename],{encoding:'utf8'});
      if(p.status!==0){console.error(filename,p.stderr);failures++;}
    }
  }
}
for(const dir of ['src','scripts','tests','projects','infrastructure']) await walk(dir);
console.log(`Syntax check: ${count} JavaScript files, ${failures} errors`);
if(failures)process.exitCode=1;
