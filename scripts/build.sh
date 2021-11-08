#!/usr/bin/bash

./createSecrets.sh

docker-compose -f ../docker-compose.yml --env-file ../config/.env/.env build --no-cache
