import { pool, tx } from '../db/pool.js';
import { config } from '../config.js';
let running = false;
/** O canal de envio (Firebase ou mock) é injetado pelo composition root (server.js). */
export async function processOutboxOnce(sender) {
  const rows = await tx(async db => {
    const r = await db.query(`SELECT id,account_id,type,payload,attempts FROM notification
      WHERE status IN ('PENDING','FAILED','PROCESSING') AND next_attempt_at<=now() AND attempts < 5
      ORDER BY created_at LIMIT 10 FOR UPDATE SKIP LOCKED`);
    for (const n of r.rows) await db.query("UPDATE notification SET status='PROCESSING',attempts=attempts+1,next_attempt_at=now()+interval '5 minutes' WHERE id=$1",[n.id]);
    return r.rows;
  });
  for (const n of rows) {
    try {
      const tokens=sender.simulated ? [] : (await pool.query('SELECT token FROM fcm_device WHERE account_id=$1',[n.account_id])).rows;
      if (sender.simulated) {
        await sender.send(null, { ...n.payload, type: n.type });
      } else {
        if (tokens.length && (!config.fcmProjectId || !config.fcmClientEmail || !config.fcmPrivateKey)) throw Error('FCM not configured');
        for (const t of tokens) await sender.send(t.token, { ...n.payload, type: n.type });
      }
      await pool.query('UPDATE notification SET status=$2,sent_at=now(),last_error=NULL WHERE id=$1', [n.id, sender.simulated ? 'SIMULATED' : 'SENT']);
    } catch(error) {
      const delay=Math.min(3600,60*2**n.attempts);
      await pool.query(`UPDATE notification SET status='FAILED',last_error=$2,
        next_attempt_at=now()+($3*interval '1 second') WHERE id=$1`,[n.id,String(error.message).slice(0,500),delay]);
      console.error(JSON.stringify({level:'error',event:'notification_retry',id:n.id,error:error.message}));
    }
  }
  return rows.length;
}
export function startOutboxWorker(sender) {
  const tick=async()=>{ if(running) return; running=true; try{await processOutboxOnce(sender);}catch(e){console.error('outbox',e.message);}finally{running=false;} };
  const timer=setInterval(tick,config.outboxIntervalMs);timer.unref();
  void tick();
  return () => clearInterval(timer);
}
