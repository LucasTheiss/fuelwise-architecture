import sql from 'mssql';
export {sql};
export async function connect(env=process.env){
  for(const key of ['AZURE_SQL_SERVER','AZURE_SQL_DATABASE','AZURE_SQL_USER','AZURE_SQL_PASSWORD'])if(!env[key])throw Error(`${key} required`);
  const local=env.SQL_LOCAL_DEVELOPMENT==='true';
  if(local&&env.NODE_ENV==='production')throw Error('Local SQL TLS exception prohibited in production');
  return new sql.ConnectionPool({server:env.AZURE_SQL_SERVER,database:env.AZURE_SQL_DATABASE,user:env.AZURE_SQL_USER,password:env.AZURE_SQL_PASSWORD,port:Number(env.AZURE_SQL_PORT||1433),options:{encrypt:true,trustServerCertificate:local},pool:{max:3,min:0,idleTimeoutMillis:10000},connectionTimeout:10000,requestTimeout:10000}).connect();
}
