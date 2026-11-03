export async function publishBatch({outbox,consumer,log=console.log}){
  const events=await outbox.claim();
  for(const item of events){try{const event=JSON.parse(item.payload);if(event.version!==1||!event.id||!event.data?.id)throw Error('Invalid event envelope');await consumer.consume(event);await outbox.ack(item.id);log(JSON.stringify({event:'event_consumed',eventId:item.id,type:event.type}));}catch{await outbox.retry(item.id,item.attempts);log(JSON.stringify({event:'event_retry',eventId:item.id,attempt:item.attempts}));}}
  return events.length;
}
export function startWorker(deps,intervalMs=5000){let stopped=false,timer;const tick=async()=>{try{await publishBatch(deps);}catch{deps.log?.(JSON.stringify({event:'worker_unavailable'}));}if(!stopped){timer=setTimeout(tick,intervalMs);timer.unref();}};void tick();return()=>{stopped=true;clearTimeout(timer);};}
