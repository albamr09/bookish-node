#!/usr/bin/bash

./createSecrets.sh

docker-compose -f "../docker-compose.yml" --env-file "../config/.env/.env" down
docker-compose -f "../docker-compose.yml" --env-file "../config/.env/.env" run app sh -c "npm test && npm run lint"
