
# 🔗 CNR Payment Blockchain System

![Hyperledger Fabric](https://img.shields.io/badge/Hyperledger-Fabric-2F3134?logo=hyperledger)
![Go](https://img.shields.io/badge/Backend-Go-00ADD8?logo=go)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker)

A next-generation blockchain payment solution for CNR (Centre National de Retraites) featuring React frontend, Go backend, and Hyperledger Fabric integration.

---

## 🚀 Features

### Core Functionality
- 🔐 **Secure Authentication** – JWT with refresh tokens
- 💸 **Payment Processing** – Real-time blockchain transactions
- ⛓ **Smart Contracts** – Custom chaincode for business logic
- 📁 **Document Management** – Secure SFTP file handling
- 🔔 **Notification System** – Email and in-app alerts

### Technical Highlights
- 🧩 **Microservices Architecture**
- 🚢 **Dockerized Components**
- 📊 **Real-time Analytics Dashboard**
- 🔄 **CI/CD Pipeline Ready**

---

## 🛠 Prerequisites

| Requirement       | Version      | Installation Guide                                                 |
|------------------|---------------|--------------------------------------------------------------------|
| Docker           | 20.10+        | [Install Docker](https://docs.docker.com/get-docker/)              |
| Docker Compose   | 1.29+         | [Install Compose](https://docs.docker.com/compose/install/)        |
| Node.js          | 16.x          | [Node.js Downloads](https://nodejs.org/en/download/)               |
| Go               | 1.20+         | [Go Installation](https://golang.org/doc/install)                  |
| MongoDB          | 5.0+          | [MongoDB Guide](https://www.mongodb.com/docs/manual/installation/) |

---

## 📂 Project Structure

```bash
.
├── frontend/                  # React TS frontend
│   └── cnr/
│       ├── public/            # Static assets
│       └── src/               # Source code
├── backend/                   # Go backend
│   ├── api/                   # REST endpoints
│   ├── feature/               # Business logic
│   ├── pkg/                   # Shared libraries
│   └── cmd/                   # Entry points
├── scripts/                   # Deployment scripts
│   ├── blockchain/            # Fabric operations
│   │   ├── deploy-cc.sh       # Chaincode deployer
│   │   ├── upgrade-cc.sh      # Chaincode updater
│   │   └── download-fabric.sh # Download fabric binaries
│   └── smartcontract.go       # Chaincode source
├── docker/                    # Docker-related files
│   ├── backend.dockerfile
│   └── frontend.dockerfile
├── docker-compose.yml         # Multi-container setup
└── README.md                  # This file
```

---

## ⚙️ Environment Variables

**Backend (`.env`)**

```env
# ================
#  SFTP Settings
# ================
SFTP_HOST=sftp:22
SFTP_USER=cnr
SFTP_PASS=root

# ===================
#  Blockchain Config
# ===================
CHAIN_CODE=cnr
CHANNEL_NAME=cnr

# ================
#  Server Config
# ================
SERVER_ADDRESS=0.0.0.0
SERVER_PORT=3000
SECRET_KEY=your_secure_key_here

# =================
#  Database Config
# =================
SERVER_ADDRESS_DB=mongodb://mongodb:27017
DB_NAME=cnr-blockchain

# =================
#  SMTP Config
# =================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_EMAIL
SMTP_PASS=YOUR_PASSWORD
```

---

## 🚀 Deployment

### 1. Clone and Setup

```bash
git clone https://github.com/ZebdaYacine/cnr-payment-blockchain.git
cd cnr-payment-blockchain
git checkout deploycode
```

---

### 2. Blockchain Deployment

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Download and install Hyperledger Fabric binaries
cd scripts
sudo download-fabric.sh
copy *.sh ../fabric-samples/test-network
copy *.go ../fabric-samples/asset-transfer-basic/chaincode-go/chaincode

# Deploy the chaincode
sudo ./deploy-cc.sh \
  -chaincode cnr \
  -channel cnr \
```

---

### 3. Start Services

```bash
docker-compose up --build -d
```

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API: [http://localhost:9000/ping](http://localhost:9000/ping)  
- MongoDB: `mongodb://mongodb:27017`

---

## 🧪 Local Development Setup

## 🖥 Frontend (React)

```bash

cd frontend/cnr
npm install
npm run dev
API web App will start on: http://localhost:5173/

```

## 🧠 Backend (Go)

```bash
#update this variables only
# ================
#  SFTP Settings
# ================
SFTP_HOST=localhost:2222
SFTP_USER=cnr
SFTP_PASS=root
# =================
#  Database Config
# =================
SERVER_ADDRESS_DB=mongodb://localhost:27017
DB_NAME=cnr-blockchain

cd backend/cmd
go mod tidy
go run main.go
API Server will start on: http://localhost:3000

```


## 📬 API Documentation

When the backend server is running, access the API docs at:

```
http://localhost:9000/api/docs
```

---

## 🛡 Security

- JWT authentication with refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- CORS and input sanitization
- Secure SMTP and SFTP handling

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/my-feature`  
3. Commit changes: `git commit -m 'Add some feature'`  
4. Push to the branch: `git push origin feature/my-feature`  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

## 🙋‍♂️ Support

If you encounter issues, please open an issue on the [GitHub repo](https://github.com/ZebdaYacine/cnr-payment-blockchain) or contact the development team.
