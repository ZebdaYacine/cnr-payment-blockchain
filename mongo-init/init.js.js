db = db.getSiblingDB("cnr-blockchain");

db.user.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/user.json')));
db.folder.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/folder.json')));
db.agence.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/agence.json')));
db.ccr.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/ccr.json')));
db.file.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/file.json')));
db.institution.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/institution.json')));
db.notification.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/notification.json')));
db.phase.insertMany(JSON.parse(cat('/docker-entrypoint-initdb.d/phase.json')));
