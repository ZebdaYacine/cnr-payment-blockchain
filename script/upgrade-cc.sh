#!/bin/bash

# Script to upgrade a smart contract (chaincode) on a Hyperledger Fabric network

# Function to display help
show_help() {
    echo "Usage: $0 -channel <channel_name> -chaincode <chaincode_name> -version <new_version> -sequence <sequence_number>"
    echo ""
    echo "Options:"
    echo "  -channel      Specify the channel name"
    echo "  -chaincode    Specify the chaincode name"
    echo "  -version      Specify the new version of the chaincode"
    echo "  -sequence     Specify the sequence number for the upgrade"
    echo "  -lang         Specify the chaincode language (node, go, etc.)"
    echo "  -h, --help    Display this help message"
}

# Function to print error messages in red
print_error() {
    echo -e "\e[31mError: $1\e[0m"
    exit 1
}

# Function to print congratulatory message in green
print_congratulations() {
    echo -e "\e[32m🎉🎉 Congratulations! Chaincode upgrade process completed! 🚀🎉\e[0m"
}

# Function to run a command and check its success
run_command() {
    eval $1
    if [ $? -ne 0 ]; then
        print_error "$2"
    fi
}

# Parse input arguments
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
        -version)
            NEW_VERSION=$2
            shift 2
            ;;
        -sequence)
            SEQUENCE_NUMBER=$2
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check required parameters
if [ -z "$CHANNEL_NAME" ] || [ -z "$CHAINCODE_NAME" ] || [ -z "$NEW_VERSION" ] || [ -z "$SEQUENCE_NUMBER" ]; then
    print_error "Missing required parameters."
    show_help
fi

cd ../asset-transfer-basic/chaincode-go
run_command "GO111MODULE=on go mod vendor" "Failed to vendor Go modules."
cd -

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

run_command "peer lifecycle chaincode package ${CHAINCODE_NAME}_${SEQUENCE_NUMBER}.tar.gz --path ../asset-transfer-basic/chaincode-go/ --lang golang --label ${CHAINCODE_NAME}_${NEW_VERSION}" "Failed to package the chaincode."

install_chaincode() {
    echo "### Configuring environment variables for $1 peer ($1 as ADMIN) ###"
    LOWER_CASE_ORG=$(echo $1 | tr '[:upper:]' '[:lower:]')
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="${1}MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/peers/peer0.${LOWER_CASE_ORG}.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/${LOWER_CASE_ORG}.example.com/users/Admin@${LOWER_CASE_ORG}.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$2
    run_command "peer lifecycle chaincode install ${CHAINCODE_NAME}_${SEQUENCE_NUMBER}.tar.gz" "Failed to install chaincode on $1 peer."
}

install_chaincode "Org1" 7051
install_chaincode "Org2" 9051

export NEW_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}_${NEW_VERSION}" | awk -F ",| " '{print $3}')
if [ -z "$NEW_PACKAGE_ID" ]; then
    print_error "Failed to retrieve package ID."
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
        --version $NEW_VERSION \
        --sequence $SEQUENCE_NUMBER \
        --package-id $NEW_PACKAGE_ID \
        --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
        "Failed to approve chaincode for $1."
}

# Approve chaincode for Org1 and Org2
approve_chaincode "Org1" 7051
approve_chaincode "Org2" 9051

run_command "peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $NEW_VERSION --sequence $SEQUENCE_NUMBER --tls --cafile \"${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem\" --output json" "Failed to check commit readiness."

run_command "peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $NEW_VERSION --sequence $SEQUENCE_NUMBER --tls --cafile \"${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem\" --peerAddresses localhost:7051 --tlsRootCertFiles \"${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt\" --peerAddresses localhost:9051 --tlsRootCertFiles \"${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt\"" "Failed to commit chaincode definition."

run_command "peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile \"${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem\" -C $CHANNEL_NAME -n $CHAINCODE_NAME --peerAddresses localhost:7051 --tlsRootCertFiles \"${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt\" --peerAddresses localhost:9051 --tlsRootCertFiles \"${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt\" -c '{\"function\":\"InitLedger\",\"Args\":[]}'" "Failed to invoke chaincode."

print_congratulations
