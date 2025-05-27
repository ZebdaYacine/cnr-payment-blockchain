// const fs = require('fs');

// db = db.getSiblingDB("cnr-blockchain");

// db.user.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/user.json')));
// db.folder.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/folder.json')));
// db.agence.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/agence.json')));
// db.ccr.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/ccr.json')));
// db.file.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/file.json')));
// db.institution.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/institution.json')));
// db.notification.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/notification.json')));
// db.phase.insertMany(JSON.parse(fs.readFileSync('/docker-entrypoint-initdb.d/phase.json')));

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
