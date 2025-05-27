#!/bin/bash

DB_NAME="cnr-blockchain"

echo "🚀 Starting MongoDB data import into database: $DB_NAME"

mongoimport --db cnr-blockchain --collection agence --file /docker-entrypoint-initdb.d/cnr-blockchain.agence.json --jsonArray
mongoimport --db cnr-blockchain --collection ccr --file /docker-entrypoint-initdb.d/cnr-blockchain.ccr.json --jsonArray
mongoimport --db cnr-blockchain --collection file --file /docker-entrypoint-initdb.d/cnr-blockchain.file.json --jsonArray
mongoimport --db cnr-blockchain --collection folder --file /docker-entrypoint-initdb.d/cnr-blockchain.folder.json --jsonArray
mongoimport --db cnr-blockchain --collection institution --file /docker-entrypoint-initdb.d/cnr-blockchain.institution.json --jsonArray
mongoimport --db cnr-blockchain --collection notification --file /docker-entrypoint-initdb.d/cnr-blockchain.notification.json --jsonArray
mongoimport --db cnr-blockchain --collection phase --file /docker-entrypoint-initdb.d/cnr-blockchain.phase.json --jsonArray
mongoimport --db cnr-blockchain --collection user --file /docker-entrypoint-initdb.d/cnr-blockchain.user.json --jsonArray

echo "✅ All data imported successfully."

