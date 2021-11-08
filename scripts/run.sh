#!/usr/bin/bash

./createSecrets.sh

docker-compose -f "../docker-compose.yml" --env-file "../config/.env/.env.dev" down
docker-compose -f "../docker-compose.yml" --env-file "../config/.env/.env.dev" up
docker-compose -f "../docker-compose.yml" --env-file "../config/.env/.env.dev" up -d
