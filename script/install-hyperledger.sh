#!/bin/bash

set -e

echo "==== Updating system ===="
sudo apt update && sudo apt upgrade -y

echo "==== Installing dependencies ===="
sudo apt install -y git curl wget docker.io docker-compose

echo "==== Starting and enabling Docker ===="
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

echo "==== Installing Go 1.23 ===="
GO_VERSION="1.23"
wget https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -xvf go${GO_VERSION}.linux-amd64.tar.gz -C /usr/local
rm go${GO_VERSION}.linux-amd64.tar.gz

# Set Go environment variables
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
source ~/.bashrc

echo "==== Verifying Go installation ===="
go version

echo "==== Setting up Go workspace ===="
mkdir -p $HOME/go/src/github.com/$USER
cd $HOME/go/src/github.com/$USER

echo "==== Downloading Hyperledger Fabric install script ===="
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x install-fabric.sh

echo "==== Running install script ===="
./install-fabric.sh docker samples binary

echo "==== Installation complete ===="
echo "Log out and log in again for Docker permissions to take effect."
