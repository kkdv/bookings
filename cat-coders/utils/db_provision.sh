#/bin/bash
# Script to provision the database,check if the database is provisioned or not and fetch its IP address

NDB_CREDS_BASE64=${NDB_CREDS_BASE64}      # set environment variable NDB_CREDS_BASE64

operationId=$(curl -s -k -X POST \
	-H "Content-Type: application/json" \
	-H "Authorization: Basic ${NDB_CREDS_BASE64}" \
        -d @./db_spec.json \
	   https://ndb.nutanix.com/era/v1.0/databases/provision \
        | python -c 'import sys, json; print(json.load(sys.stdin)["operationId"])')

#operationId="90174490-2079-44ab-a465-766f419b085d"

echo "DB provisioning job submitted, operationId=${operationId}"

percentageComplete=0
while [ "${percentageComplete}" != "100" ]
do
  echo -ne "Sleeping 30 seconds, percentageComplete=${percentageComplete}\r"; sleep 30
  percentageComplete=$(curl -s -k -X GET  \
                       -H "Content-Type: application/json"  \
		       -H "Authorization: Basic ${NDB_CREDS_BASE64} "  https://ndb.nutanix.com/era/v1.0/operations/${operationId} \
			| python -c 'import sys, json; print(json.load(sys.stdin)["percentageComplete"])')
done

echo "DB provisioning completed, percentageComplete=${percentageComplete}"  

echo "Fetching public IP"  

public_IP=$(curl -s -k -X GET \
	-H "Content-Type: application/json"  \
	-H "Authorization: Basic $NDB_CREDS_BASE64" \
	"https://ndb.nutanix.com/era/v1.0/dbservers?value-type=name&value=booking_pgdb_VM" | python -c 'import sys, json; print(json.load(sys.stdin)[0]["ipAddresses"][1])')

echo "DB VM :booking_pgdb_VM, public IP address=${public_IP}, update src/server/config.js with this IP"
 
