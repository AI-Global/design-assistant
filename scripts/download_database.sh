#!/bin/bash
# Dump the MongoDB Database to a local archive and upload it to local mongodb
# WARNING: THIS WILL OVERWRITE THE TARGET DATABASE WITH EXTREME PREJUDICE
source .env
mongodump --archive=$ARCHIVE --uri $REMOTE_URI  --db $REMOTE_DB --username $USERNAME  --password $PASSWORD
mongorestore --archive=$ARCHIVE --drop --host $LOCAL_HOST  --nsFrom=$REMOTE_NS --nsTo=$LOCAL_NS