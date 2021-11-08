#!/usr/bin/bash

ENV_DIR="../config/.env/.env"

# Load environment variables
set -o allexport
source $ENV_DIR
set +o allexport

# Create secrets
echo $DB_ROOT_USER > $SECRETS_DIR"/db_root_user"
echo $DB_ROOT_PASSWORD > $SECRETS_DIR"/db_root_passwd"
echo $DB_USER > $SECRETS_DIR"/db_user"
echo $DB_PASSWORD > $SECRETS_DIR"/db_passwd"
echo $TOKEN_SECRET > $SECRETS_DIR"/token_secret"
echo $DB_URI > $SECRETS_DIR"/db_uri"
echo $DB_NAME > $SECRETS_DIR"/db_name"

