import bcrypt from 'bcryptjs';
import { tx, one } from '../../../shared/db/pool.js';
import { badRequest } from '../../../shared/http/errors.js';
import { isValidTaxId } from '../../../shared/utils/taxId.js';
import { audit } from '../../../shared/utils/audit.js';
export async function execute({body}) {
  const {carrier,manager} = body;
  if (!isValidTaxId(carrier.taxId)) throw badRequest('Invalid CNPJ');
  const hash = await bcrypt.hash(manager.password,12);
  return tx(async db => {
    const t=await one(db,`INSERT INTO carrier(name,legal_name,tax_id)
      VALUES ($1,$2,$3) RETURNING id,name,legal_name,tax_id,status`,
      [carrier.name,carrier.legalName,carrier.taxId]);
    const u=await one(db,`INSERT INTO account (name,email,password_hash,role) VALUES($1,$2,$3,'MANAGER')
      RETURNING id,name,email,role`,[manager.name,manager.email,hash]);
    await db.query('INSERT INTO manager(account_id,carrier_id) VALUES($1,$2)',[u.id,t.id]);
    await audit(db,{actorId:u.id,tenantId:t.id,resource:'carrier',resourceId:t.id,action:'REQUEST_CREATED'});
    return {carrier:t,manager:u,message:'Carrier registration pending administrator approval'};
  });
}
