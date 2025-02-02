# Set the path to Fabric configuration files
export FABRIC_CFG_PATH="/home/zedyacine/Desktop/fabric-samples/config"

# Set the MSP ID for the organization (Org1 in this case)
export CORE_PEER_LOCALMSPID="Org1MSP"

# Set the MSP path to the admin identity (adjust if using another org)
export CORE_PEER_MSPCONFIGPATH="/home/zedyacine/Desktop/fabric-samples/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"

# Set the peer address
export CORE_PEER_ADDRESS="localhost:7051"

# Set the orderer address (only needed for invoking transactions)
export ORDERER_ADDRESS="localhost:7050"
