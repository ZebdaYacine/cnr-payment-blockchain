#!/bin/bash

# Display help message
show_help() {
    echo "Usage: $0 -channel <channel_name> -chaincode <chaincode_name> -function <function_name>"
    echo ""
    echo "Options:"
    echo "  -channel     Specify the name of the channel to create or use"
    echo "  -chaincode   Specify the name of the chaincode to deploy"
    echo "  -function    Specify the function to invoke on the chaincode"
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
        -function)
            FUNCTION_NAME=$2
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
if [[ -z "$CHANNEL_NAME" || -z "$CHAINCODE_NAME" || -z "$FUNCTION_NAME" ]]; then
    print_error "The -channel, -chaincode, and -function arguments are required."
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

# Ensure Fabric binaries are in PATH
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/

# Ensure MSP path is set
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

# Check if MSP path exists
if [[ ! -d "$CORE_PEER_MSPCONFIGPATH" ]]; then
    print_error "MSP path does not exist: $CORE_PEER_MSPCONFIGPATH"
    exit 1
fi

# Check if 'peer' command is available
if ! command -v peer &> /dev/null; then
    print_error "The 'peer' command is not found. Ensure that Fabric binaries are correctly set up in the PATH."
    exit 1
fi

# Check if peer is running
if ! nc -z localhost 7051; then
    print_error "Peer node is not running on port 7051. Ensure that the Fabric network is up."
    exit 1
fi

# Check if orderer is running
if ! nc -z localhost 7050; then
    print_error "Orderer is not running on port 7050. Restart the Fabric network."
    exit 1
fi

# Check if CouchDB is running (if applicable)
if docker ps | grep -q couchdb; then
    echo "CouchDB is running."
else
    print_error "CouchDB is not running. Restarting it may be required."
fi

# Check if chaincode container is running
if ! docker ps | grep -q "dev-peer"; then
    print_error "Chaincode container is not running. Ensure the chaincode is installed and committed."
    exit 1
fi

# Invoke the chaincode with the specified function
echo "##################################################"
echo "# Invoking the chaincode with function '$FUNCTION_NAME' #"
echo "##################################################"
run_command "peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls --cafile \${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
    -C $CHANNEL_NAME \
    -n $CHAINCODE_NAME \
    --peerAddresses localhost:7051 \
    --tlsRootCertFiles \${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 \
    --tlsRootCertFiles \${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
    -c '{\"function\":\"$FUNCTION_NAME\",\"Args\":[]}'" \
    "Failed to invoke the chaincode."

# Congratulatory message
print_congratulations
