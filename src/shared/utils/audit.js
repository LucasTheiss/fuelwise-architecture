export async function audit(db, { actorId=null, tenantId=null, resource, resourceId=null, action, details={} }) {
  await db.query(`INSERT INTO audit_event (actor_account_id,carrier_id,resource,resource_id,action,details)
    VALUES ($1,$2,$3,$4,$5,$6::jsonb)`, [actorId,tenantId,resource,resourceId,action,JSON.stringify(details)]);
}
export async function enqueue(db, userId, type, payload) {
  await db.query('INSERT INTO notification (account_id,type,payload) VALUES ($1,$2,$3::jsonb)',[userId,type,JSON.stringify(payload)]);
}
