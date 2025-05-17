#!/bin/bash

# Hyperledger Fabric Automated Installer (Go-only version)
# Downloads and installs Fabric samples, binaries, and dependencies
# Tested on Ubuntu 20.04/22.04

# Exit on error and show commands
set -ex

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for root
if [ "$(id -u)" -ne 0 ]; then
  echo -e "${YELLOW}Running as non-root user. Some commands may need sudo privileges.${NC}"
fi

# Install prerequisites
echo -e "${GREEN}Installing system dependencies...${NC}"
sudo apt-get update
sudo apt-get install -y \
  curl \
  git \
  docker.io \
  docker-compose \
  golang \
  jq

# Verify Docker is running
sudo systemctl enable --now docker

# Install Go (if not installed or version is too old)
if ! command -v go &> /dev/null || [ $(go version | awk '{print $3}' | cut -d'.' -f2) -lt 18 ]; then
  echo -e "${GREEN}Installing Go...${NC}"
  wget https://golang.org/dl/go1.20.linux-amd64.tar.gz
  sudo tar -C /usr/local -xzf go1.20.linux-amd64.tar.gz
  export PATH=$PATH:/usr/local/go/bin
  echo "export PATH=\$PATH:/usr/local/go/bin" >> ~/.bashrc
  rm go1.20.linux-amd64.tar.gz
fi

# Add user to docker group
echo -e "${GREEN}Adding current user to docker group...${NC}"
sudo usermod -aG docker $USER || true

# Download and install Fabric
echo -e "${GREEN}Downloading Hyperledger Fabric...${NC}"
curl -sSL https://bit.ly/2ysbOFE | bash -s -- --fabric-version 2.4.4 --ca-version 1.5.2