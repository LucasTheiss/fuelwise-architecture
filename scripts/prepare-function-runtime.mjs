import {randomBytes} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';

// Disposable local keys, never Azure credentials; both destinations are ignored.
const key = randomBytes(32).toString('base64url');
await mkdir('tmp/function-secrets', {recursive: true});
await writeFile('tmp/function-secrets/host.json', JSON.stringify({
  masterKey: {name: 'master', value: randomBytes(32).toString('base64url'), encrypted: false},
  functionKeys: [{name: 'default', value: key, encrypted: false}],
  systemKeys: []
}), {mode: 0o600});
await writeFile('.env.function-runtime', `FUNCTION_KEY=${key}\nLOCAL_STORAGE_KEY=${randomBytes(64).toString('base64')}\n`, {mode: 0o600});
console.log('Local Functions keys written to ignored files. No cloud resources created.');
