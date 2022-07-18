#!/bin/bash
# Script to check if the database is provisioned or not

NDB_CREDS_BASE64=${NDB_CREDS_BASE64}
curl -s -k -X GET  \
     	-H "Content-Type: application/json"  \
	-H "Authorization: Basic ${NDB_CREDS_BASE64} "  https://ndb.nutanix.com/era/v1.0/operations/${1} \
	| python -c 'import sys, json; print(json.load(sys.stdin)["percentageComplete"])'

