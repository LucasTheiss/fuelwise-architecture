export function identity(baseUrl) {
  if(!baseUrl) throw Error('LEGACY_URL required');
  return async bearer=>{
    if(!bearer?.startsWith('Bearer ')) throw Object.assign(Error('Autenticação necessária'),{status:401});
    let r;
    try { r=await fetch(`${baseUrl}/api/v1/auth/me`,{headers:{authorization:bearer},signal:AbortSignal.timeout(5000)}); }
    catch { throw Object.assign(Error('Identidade indisponível'),{status:503}); }
    if(!r.ok) throw Object.assign(Error('Autenticação recusada'),{status:r.status===401||r.status===403?401:503});
    const {account}=await r.json();
    if(!account?.id || !['ADMIN','MANAGER','DRIVER'].includes(account.role)) throw Object.assign(Error('Identidade inválida'),{status:503});
    return account;
  };
}
