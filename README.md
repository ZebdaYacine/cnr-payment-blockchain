<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CNR Payment Blockchain System</title>
  <style>
    body {
      font-family: monospace;
      background-color: #f9f9f9;
      padding: 20px;
    }
    pre {
      white-space: pre-wrap;
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 20px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <pre><code>
CNR Payment Blockchain System
=============================

A comprehensive payment and blockchain system for CNR (Centre National de Recherche) built with React, Go, and MongoDB.

Features
--------

- User authentication and authorization
- Payment processing
- Blockchain integration
- Notification system
- File management
- Real-time updates

Prerequisites
-------------

- Docker
- Docker Compose
- Node.js (for local development)
- Go (for local development)
- MongoDB (for local development)

Project Structure
-----------------

.
├── frontend/              # React frontend application
│   └── cnr/               # Main frontend code
├── backend/               # Go backend application
│   ├── api/               # API handlers
│   ├── feature/           # Business logic
│   ├── pkg/               # Shared packages
│   └── cmd/               # Application entry point
│   └── .env/              # Env file for backend
├── script/                # Fabric deployment scripts
│   ├── deploy-cc/         # Deploy Hyperledger Fabric network
│   ├── download-cc/       # Download Fabric repository
│   ├── upgrade-cc/        # Upgrade chain code
│   └── smartcontract.go/  # Full chain code
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # This file

Environment Variables
---------------------

Backend (.env)

SFTP CONFIGURATION
------------------
SFTP_HOST=sftp:22 
SFTP_USER=cnr
SFTP_PASS=root

BLOCKCHAIN CONFIGURATION
------------------------
CHAIN_CODE=cnr
CHANNEL_NAME=cnr

SERVER CONFIGURATION
--------------------
SERVER_ADDRESS=0.0.0.0
SERVER_PORT=3000
SECRET_KEY=YOUR_SECRET_KEY

DATABASE CONFIGURATION
----------------------
PASSWORD_DB=
PASSWORD_USER=
SERVER_ADDRESS_DB=mongodb://mongodb:27017
DB_NAME=cnr-blockchain

SMTP CONFIGURATION
------------------
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_EMAIL
SMTP_PASS=YOUR_PWD

Deployment
----------

Using Docker Compose
--------------------

1. Clone the repository:

   git clone https://github.com/ZebdaYacine/cnr-payment-blockchain.git
   cd cnr-payment-blockchain
   git switch deploycode 
   cd scripts

   copy deploy-cc.sh fabric-samples/test-network
   copy download-cc.sh fabric-samples/test-network
   copy upgrade-cc.sh fabric-samples/test-network

   chmod +x deploy-cc.sh download-cc.sh upgrade-cc.sh
   copy smartcontract.go fabric-samples/asset-transfer-basic/chaincode-go/chaincode
   copy smartcontract_test.go fabric-samples/asset-transfer-basic/chaincode-go/chaincode

   sudo ./deploy-cc.sh -chaincode cnr -channel cnr make awesome
  </code></pre>
</body>
</html>
