import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidTaxId } from '../src/shared/utils/taxId.js';
test('CNPJ de exemplo válido',()=>assert.equal(isValidTaxId('11.222.333/0001-81'),true));
test('CNPJ inválido e sequências repetidas',()=>{
  assert.equal(isValidTaxId('11.222.333/0001-82'),false);
  assert.equal(isValidTaxId('00.000.000/0000-00'),false);
});
