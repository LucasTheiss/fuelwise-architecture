import { tx,one } from '../../../shared/db/pool.js';
import { notFound,conflict } from '../../../shared/http/errors.js';
import { audit,enqueue } from '../../../shared/utils/audit.js';
export async function execute({actor,params,body}) {
  return tx(async db=>{
    const d=await one(db,'SELECT * FROM complaint WHERE id=$1 FOR UPDATE',[params.id]);
    if(!d) throw notFound('Denúncia');
    if(['RESOLVED','REJECTED'].includes(d.status)) throw conflict('Denúncia já encerrada');
    const result=await one(db,`UPDATE complaint SET status=$2,moderation_note=$3,verified_by_admin_id=$4,
      verified_at=now() WHERE id=$1 RETURNING *`,[params.id,body.status,body.note,actor.id]);
    await enqueue(db,d.reporter_account_id,'COMPLAINT_UPDATED',{message:`Sua denúncia está ${body.status.toLowerCase()}`,complaintId:d.id});
    await audit(db,{actorId:actor.id,resource:'complaint',resourceId:d.id,action:body.status});
    return {complaint:result};
  });
}
