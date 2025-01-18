#!/bin/bash
sudo systemctl start docker
cd ~/Dekstop/cnr-blockchain/fabric-samples/test-network
./network.sh up
