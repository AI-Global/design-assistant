#!/bin/bash
# Dump the MongoDB Database to a TARGET archive and upload it to a new mongodb
#
# To use this script, you need a .env file with the following variables:
#
ARCHIVE=rai-archive
SOURCE_DB=rai-design-assistant-dev
SOURCE_NS=rai-design-assistant-dev.*
TARGET_DB=rai-design-assistant-dev
TARGET_NS=rai-design-assistant-dev.*
SOURCE_USERNAME=OpromaAdmin
SOURCE_PASSWORD=ZVyGDeCJSPXFC4o6
TARGET_USERNAME=OpromaAdmin
SOURCE_HOST="cluster0-shard-00-00.krmr3.mongodb.net:27017,cluster0-shard-00-01.krmr3.mongodb.net:27017,cluster0-shard-00-02.krmr3.mongodb.net:27017"
SOURCE_URI="mongodb+srv://OpromaAdmin:ZVyGDeCJSPXFC4o6@cluster0.krmr3.mongodb.net/rai-design-assistant-dev?authSource=admin&replicaSet=atlas-knlgon-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true"
TARGET_USERNAME=dbUser
TARGET_PASSWORD=ILgnom1727
TARGET_URI="mongodb+srv://inthority.t38hv.azure.mongodb.net/rai-design-assistant-dev"

# WARNING: THIS WILL OVERWRITE THE TARGET DATABASE WITH EXTREME PREJUDICE
source .env
# mongodump --archive=$ARCHIVE --uri $SOURCE_URI  --db $SOURCE_DB --username $SOURCE_USERNAME  --password $SOURCE_PASSWORD
mongodump --archive=$ARCHIVE --host=$SOURCE_HOST --db=$SOURCE_DB --username=$SOURCE_USERNAME  --password=$SOURCE_PASSWORD --ssl --authenticationDatabase=admin
# mongorestore --archive=$ARCHIVE --drop --uri $TARGET_URI  --username $TARGET_USERNAME --password $TARGET_PASSWORD --nsFrom=$SOURCE_NS --nsTo=$TARGET_NS