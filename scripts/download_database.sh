#!/bin/bash
# Dump the MongoDB Database to a local archive and upload it to local mongodb

ARCHIVE=archive
REMOTE_DB=rai-certification-1
REMOTE_NS=rai-certification-1.*
LOCAL_DB=rai-local-dev
LOCAL_NS=rai-local-dev.*
PASSWORD=XptbITzKsfyZe8zp
USERNAME=OpromaAdmin
REMOTE_URI=mongodb+srv://cluster0.krmr3.mongodb.net/
LOCAL_HOST="localhost:27017"

mongodump --archive=$ARCHIVE --uri $REMOTE_URI  --db $REMOTE_DB --username $USERNAME  --password $PASSWORD
mongorestore --archive=$ARCHIVE --drop --host $LOCAL_HOST  --nsFrom=$REMOTE_NS --nsTo=$LOCAL_NS