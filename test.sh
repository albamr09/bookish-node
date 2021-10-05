#!/usr/bin/bash

docker-compose -f docker-compose.dev.yml build --no-rm --no-cache
docker-compose -f docker-compose.dev.yml --force-recreate -d --remove-orphans 
docker-compose -f docker-compose.dev.yml run app sh -c "npm test"
