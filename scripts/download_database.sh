#!/bin/bash
# Dump the MongoDB Database to a local archive and upload it to local mongodb
#
# To use this script, you need a .env file with the following variables:
#
# ARCHIVE=<archive_name>
# REMOTE_DB=<rai-certification-1>
# REMOTE_NS=rai-certification-1.*
# LOCAL_DB=rai-local-dev
# LOCAL_NS=rai-local-dev.*
# PASSWORD=<remote_password>
# USERNAME=<remote_username>
# REMOTE_URI=mongodb+srv://cluster0.krmr3.mongodb.net/
# LOCAL_HOST="localhost:27017"

# WARNING: THIS WILL OVERWRITE THE TARGET DATABASE WITH EXTREME PREJUDICE
source .env
mongodump --archive=$ARCHIVE --uri $REMOTE_URI  --db $REMOTE_DB --username $USERNAME  --password $PASSWORD
mongorestore --archive=$ARCHIVE --drop --host $LOCAL_HOST  --nsFrom=$REMOTE_NS --nsTo=$LOCAL_NS