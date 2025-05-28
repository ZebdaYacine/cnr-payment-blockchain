#!/bin/sh

mongoimport --db cnr-blockchain --collection user --file /docker-entrypoint-initdb.d/user.json --jsonArray
mongoimport --db cnr-blockchain --collection folder --file /docker-entrypoint-initdb.d/folder.json --jsonArray
mongoimport --db cnr-blockchain --collection agence --file /docker-entrypoint-initdb.d/agence.json --jsonArray
mongoimport --db cnr-blockchain --collection ccr --file /docker-entrypoint-initdb.d/ccr.json --jsonArray
mongoimport --db cnr-blockchain --collection file --file /docker-entrypoint-initdb.d/file.json --jsonArray
mongoimport --db cnr-blockchain --collection institution --file /docker-entrypoint-initdb.d/institution.json --jsonArray
mongoimport --db cnr-blockchain --collection notification --file /docker-entrypoint-initdb.d/notification.json --jsonArray
mongoimport --db cnr-blockchain --collection phase --file /docker-entrypoint-initdb.d/phase.json --jsonArray

echo "Data import completed."
