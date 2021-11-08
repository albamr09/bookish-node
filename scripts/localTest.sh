#!/usr/bin/bash

docker-compose -f "../docker-compose.dev.yml" --env-file "../config/.env/.env.dev" down
docker-compose -f "../docker-compose.dev.yml" --env-file "../config/.env/.env.dev" run app sh -c "npm run localTest -- $1"
