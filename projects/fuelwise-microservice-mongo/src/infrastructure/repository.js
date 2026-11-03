import { randomUUID } from 'node:crypto';
export function mongoRepository(db) {
  const stations=db.collection('stations'), prices=db.collection('prices');
  const clean=x=>{if(!x)return null; const {_id,location,...data}=x; return data;};
  const fields=x=>({name:x.name,address:x.address,latitude:x.latitude,longitude:x.longitude,is_affiliated:x.isAffiliated,location:{type:'Point',coordinates:[x.longitude,x.latitude]}});
  return {
    async initialize(){await stations.createIndex({id:1},{unique:true});await stations.createIndex({location:'2dsphere'});await prices.createIndex({station_id:1,effective_from:-1});},
    ready:()=>db.command({ping:1}),
    async create(data){const x={id:randomUUID(),...fields(data),is_active:true,created_at:new Date()};await stations.insertOne(x);return clean(x);},
    async list(q){const filter={is_active:true};if(q.isAffiliated!==undefined)filter.is_affiliated=q.isAffiliated==='true';
      if(q.latitude!==undefined)filter.location={$near:{$geometry:{type:'Point',coordinates:[q.longitude,q.latitude]},$maxDistance:q.radiusKm*1000}};
      let cursor=stations.find(filter);if(q.latitude===undefined)cursor=cursor.sort({name:1,id:1});
      return (await cursor.skip((q.page-1)*q.limit).limit(q.limit).toArray()).map(clean);},
    async get(id){return clean(await stations.findOne({id,is_active:true}));},
    async currentPrices(id){return(await prices.aggregate([{$match:{station_id:id,effective_from:{$lte:new Date()}}},{$sort:{effective_from:-1,_id:-1}},{$group:{_id:'$fuel_type',price:{$first:'$$ROOT'}}},{$replaceRoot:{newRoot:'$price'}}]).toArray()).map(clean);},
    async update(id,data){return clean(await stations.findOneAndUpdate({id,is_active:true},{$set:fields(data)},{returnDocument:'after'}));},
    async deactivate(id){return clean(await stations.findOneAndUpdate({id,is_active:true},{$set:{is_active:false}},{returnDocument:'after'}));},
    async addPrice(id,data){const x={id:randomUUID(),station_id:id,fuel_type:data.fuelType,price_per_liter:data.pricePerLiter.toFixed(3),effective_from:new Date()};await prices.insertOne(x);return clean(x);},
    async prices(id,q){const filter={station_id:id};if(q.type)filter.fuel_type=q.type;return(await prices.find(filter).sort({effective_from:-1,_id:-1}).skip((q.page-1)*q.limit).limit(q.limit).toArray()).map(clean);}
  };
}
