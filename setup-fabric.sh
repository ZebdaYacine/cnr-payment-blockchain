#!/bin/bash

# Create necessary directories
mkdir -p fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls
mkdir -p fabric-samples/test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls

# Generate certificates
docker run --rm -v $(pwd):/workdir hyperledger/fabric-tools:2.5 cryptogen generate --config=/workdir/fabric-network/crypto-config.yaml --output=/workdir/fabric-samples/test-network/organizations

# Copy certificates to the correct location
cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt backend/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/

# Start the network
cd fabric-network
docker-compose -f docker-compose-fabric.yml up -d

# Wait for the network to be ready
sleep 10

# Create and join channel
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec cli peer channel join -b mychannel.block

echo "Fabric network is up and running!" 