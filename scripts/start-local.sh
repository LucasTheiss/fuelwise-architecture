#!/usr/bin/env sh
set -eu
# Automatically starts PostgreSQL, runs migrations/initial admin seed, then starts the API.
docker compose up -d --build
printf 'API: http://localhost:3000 | Readiness: http://localhost:3000/health/ready\n'
