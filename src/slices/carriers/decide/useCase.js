import { tx,one,many } from '../../../shared/db/pool.js';
import { badRequest,conflict,notFound } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
export async function execute({actor,params,body}) {
  if (body.decision==='REJECT' && !body.reason?.trim()) throw badRequest('Informe o reason da recusa');
  return tx(async db=>{
    const exists=await one(db,'SELECT id,status FROM carrier WHERE id=$1 FOR UPDATE',[params.id]);
    if (!exists) throw notFound('Transportadora');
    if (exists.status!=='PENDING') throw conflict('Solicitação já analisada');
    const status=body.decision==='APPROVE'?'ACTIVE':'REJECTED';
    const updated=await one(db,`UPDATE carrier SET status=$2,rejection_reason=$3,decided_at=now()
      WHERE id=$1 RETURNING id,name,status,rejection_reason,decided_at`,[params.id,status,body.reason??null]);
    const managers=await many(db,'SELECT account_id FROM manager WHERE carrier_id=$1',[params.id]);
    for(const m of managers) await enqueue(db,m.account_id,'CARRIER_DECISION',{message:`Solicitação de cadastro ${status.toLowerCase()}`,status,reason:body.reason??null});
    await audit(db,{actorId:actor.id,tenantId:params.id,resource:'carrier',resourceId:params.id,action:status,details:{reason:body.reason??null}});
    return {carrier:updated};
  });
}
