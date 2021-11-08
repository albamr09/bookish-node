#!/usr/bin/bash

ENV_DIR="../config/.env/.env"

# Load environment variables
set -o allexport
source $ENV_DIR
set +o allexport

REL_SECRETS_DIR="../"$SECRETS_DIR

# Create secrets
echo $DB_ROOT_USER > $REL_SECRETS_DIR"/db_root_user"
echo $DB_ROOT_PASSWORD > $REL_SECRETS_DIR"/db_root_passwd"
echo $DB_USER > $REL_SECRETS_DIR"/db_user"
echo $DB_PASSWORD > $REL_SECRETS_DIR"/db_passwd"
echo $TOKEN_SECRET > $REL_SECRETS_DIR"/token_secret"
echo $DB_URI > $REL_SECRETS_DIR"/db_uri"
echo $DB_NAME > $REL_SECRETS_DIR"/db_name"

