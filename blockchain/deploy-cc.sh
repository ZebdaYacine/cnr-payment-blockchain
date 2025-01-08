#!/bin/bash

# Display help message
show_help() {
    echo "Usage: $0 -channel <channel_name> -chaincode <chaincode_name>"
    echo ""
    echo "Options:"
    echo "  -channel     Specify the name of the channel to create or use"
    echo "  -chaincode   Specify the name of the chaincode to deploy"
    echo "  -h, --help   Display this help message and exit"
}

# Function to print error messages in red
print_error() {
    echo -e "\e[31mError: $1\e[0m"
}

# Function to print congratulatory message in green
print_congratulations() {
    echo -e "\e[32m🎉🎉 Congratulations! Your blockchain network has been built successfully with your own smart contract! 🚀🎉\e[0m"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -channel)
            CHANNEL_NAME=$2
            shift 2
            ;;
        -chaincode)
            CHAINCODE_NAME=$2
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if required arguments are provided
if [[ -z "$CHANNEL_NAME" || -z "$CHAINCODE_NAME" ]]; then
    print_error "Both -channel and -chaincode arguments are required."
    show_help
    exit 1
fi

# Function to execute a command and handle errors
run_command() {
    eval "$1"
    if [[ $? -ne 0 ]]; then
        print_error "$2"
        exit 1
    fi
}

# Start the script
echo "###########################################"
echo "# Stopping and cleaning up the network... #"
echo "###########################################"
run_command "./network.sh down" "Failed to stop and clean up the network."

echo "########################################################"
echo "# Creating a new channel named '${CHANNEL_NAME}'...    #"
echo "########################################################"
run_command "./network.sh createChannel -c $CHANNEL_NAME" "Failed to create the channel '$CHANNEL_NAME'."

cd ../asset-transfer-basic/chaincode-go
run_command "GO111MODULE=on go mod vendor" "Failed to vendor Go modules."
cd -

echo "#################################################################################"
echo "# Setting PATH and FABRIC_CFG_PATH for the Fabric binaries and configuration... #"
echo "#################################################################################"
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

echo "##################################################"
echo "#             Create chaincode package           #"
echo "##################################################"
run_command "peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ../asset-transfer-basic/chaincode-go/ --lang golang --label ${CHAINCODE_NAME}_1.0" \
    "Failed to create the chaincode package."

install_chaincode() {
    echo "### Configuring environment variables for $1 peer ($1 as ADMIN) ###"
    LOWER_CASE_ORG=$(echo $1 | tr '[:upper:]' '[:lower:]')
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="${1}MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/peers/peer0.${LOWER_CASE_ORG}.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/users/Admin@${LOWER_CASE_ORG}.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$2
    echo "### Installing the chaincode on the peer ###"
    run_command "peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz" "Failed to install chaincode on $1 peer."
}


# Install chaincode on Org1 and Org2
install_chaincode "Org1" 7051
install_chaincode "Org2" 9051

echo "##################################################"
echo "#           Approve a chaincode definition       #"
echo "##################################################"

export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "Package ID:" | awk -F '[:, ]+' '{print $3 ":" $4}')
if [[ -z "$CC_PACKAGE_ID" ]]; then
    print_error "Failed to retrieve chaincode package ID."
    exit 1
fi

approve_chaincode() {
    echo "### Approving chaincode definition for $1 ###"
    LOWER_CASE_ORG=$(echo $1 | tr '[:upper:]' '[:lower:]')
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="${1}MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/peers/peer0.${LOWER_CASE_ORG}.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/users/Admin@${LOWER_CASE_ORG}.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$2

    run_command "peer lifecycle chaincode approveformyorg \
        -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --channelID $CHANNEL_NAME \
        --name $CHAINCODE_NAME \
        --version 1.0 \
        --package-id $CC_PACKAGE_ID \
        --sequence 1 \
        --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
        "Failed to approve chaincode for $1."
}

# Approve chaincode for Org1 and Org2
approve_chaincode "Org1" 7051
approve_chaincode "Org2" 9051

echo "##################################################"
echo "# Checking commit readiness for chaincode        #"
echo "##################################################"
run_command "peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME \
    --name $CHAINCODE_NAME \
    --version 1.0 \
    --sequence 1 \
    --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --output json" \
    "Chaincode is not ready to be committed."

echo "##################################################"
echo "# Committing the chaincode definition to channel #"
echo "##################################################"
run_command "peer lifecycle chaincode commit \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --channelID $CHANNEL_NAME \
    --name $CHAINCODE_NAME \
    --version 1.0 \
    --sequence 1 \
    --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
    "Failed to commit the chaincode definition."

echo "##################################################"
echo "# Querying the committed chaincode               #"
echo "##################################################"
run_command "peer lifecycle chaincode querycommitted \
    --channelID $CHANNEL_NAME \
    --name $CHAINCODE_NAME \
    --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    "Failed to query the committed chaincode."

echo "##################################################"
echo "# Invoking the chaincode                         #"
echo "##################################################"
run_command "peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C $CHANNEL_NAME \
    -n $CHAINCODE_NAME \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{\"function\":\"InitLedger\",\"Args\":[]}'" \
    "Failed to invoke the chaincode."

# Congratulatory message
print_congratulations
