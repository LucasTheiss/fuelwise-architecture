import bcrypt from 'bcryptjs';
import { tx,one } from '../../../shared/db/pool.js';
import { audit } from '../../../shared/utils/audit.js';
export async function execute({actor,body}) {
  const hash=await bcrypt.hash(body.password,12);
  return tx(async db=>{
    const user=await one(db,"INSERT INTO account(name,email,password_hash,role) VALUES($1,$2,$3,'DRIVER') RETURNING id,name,email,role",[body.name,body.email,hash]);
    await db.query('INSERT INTO driver (account_id,carrier_id,driver_license) VALUES ($1,$2,$3)',[user.id,actor.carrier_id,body.driverLicense]);
    await audit(db,{actorId:actor.id,tenantId:actor.carrier_id,resource:'driver',resourceId:user.id,action:'CREATED'});
    return {driver:{...user,driverLicense:body.driverLicense}};
  });
}
