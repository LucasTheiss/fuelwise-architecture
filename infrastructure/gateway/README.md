# Gateway

Reverse proxy independente do BFF, sem regra de negócio. `npm ci`, `npm test`,
`BFF_URL=http://localhost:3003 CORS_ORIGIN=http://localhost:5173 npm start` (Bash).
PowerShell: definir variáveis com `$env:`. Porta 8080. Limite 120/min/IP e
20/15min nas rotas de autenticação. Só encaminha API, agregação e documentação.

Produção exige TLS_CERT_FILE/TLS_KEY_FILE ou TLS_TERMINATED_UPSTREAM=true
somente atrás de terminador HTTPS confiável. Não exponha o HTTP diretamente.
Não confiar em X-Forwarded-For do cliente. Atrás de proxy, definir TRUST_PROXY_HOPS (Azure Container Apps: 1)
para a topologia real antes da publicação; default conservador pode limitar
todos os clientes pelo IP do proxy. Uma instância; rate limit em memória.
Não existe URL pública provisionada. Nenhum serviço pago é necessário ao código.
