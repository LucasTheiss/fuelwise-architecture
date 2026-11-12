# Roteiro do vídeo — FuelWise, Entrega 3

A gravação é feita em duas etapas, cada uma com o seu roteiro:

| Etapa | Arquivo | Quem faz | Por que é separado |
|---|---|---|---|
| 1. Gravação de tela | [roteiro-tela.md](roteiro-tela.md) | Uma pessoa, sem áudio | Ações e o que precisa aparecer, com tempo por seção; exige preparação da cloud |
| 2. Dublagem | [roteiro-falas.md](roteiro-falas.md) | Os quatro integrantes | Textos por seção; cada um diz o nome (exigência "todos falam, explícito") |

Seções **S1–S5** e tempos são iguais nos dois arquivos.

## Requisitos do enunciado → onde aparecem

| Requisito do vídeo | Seção |
|---|---|
| YouTube não listado | Fim de `roteiro-tela.md` e de `roteiro-falas.md` |
| Todos falam, de forma explícita | S1–S4 (nome no início) + S5 (os quatro) + legenda com nome |
| URLs da internet/cloud, não localhost | Regras de `roteiro-tela.md`; S1.3 |
| Frontend funcionando | S1, S2, S3, S4.1 |
| Chamadas passando pelo BFF | S1.5 (Network → gateway), S2.4, S4.2–4.3 |
| CRUD / regra de negócio completo | S2 (postos), S3 (viagens + conflito 409) |
| Integração com MongoDB | S2.6, S2.8 |
| Integração com SQL Server | S3.8, S3.9, S4.6–4.7 |
| Integração com Function | S4.2, S4.4 |
| Eventos | S4.5–4.8 |
| Fluxo completo da arquitetura | S1.1–1.2 + S4.2 |

## Cloud no dia da gravação

- Antes: `bash scripts/deploy-azure.sh hold`. Mantém 1 réplica por app: o IP de
  saída não muda, não há cold start e os dados de demo não zeram. Já libera o IP
  no Azure SQL e no Atlas.
- Depois: `bash scripts/deploy-azure.sh release`. Sem isso, as réplicas fixas
  consomem o grant gratuito (cerca de 25 h por mês com os sete apps).

Validação de 12/11/2026: os passos de S1–S4 foram executados no navegador contra
as URLs públicas (11/11 verificações aprovadas). Telas do Atlas, Query editor e
Log stream do portal não foram automatizadas; o conteúdo foi conferido por CLI.
