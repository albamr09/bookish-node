#!/usr/bin/bash

docker-compose -f ../docker-compose.dev.yml --env-file ../config/.env/.env.dev build --no-cache
