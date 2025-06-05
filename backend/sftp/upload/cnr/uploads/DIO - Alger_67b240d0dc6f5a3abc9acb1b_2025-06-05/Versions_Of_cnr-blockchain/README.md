<!DOCTYPE html>
<html>
<head>

</head>
<body>


# CNR Payment Blockchain System

A comprehensive payment and blockchain system for CNR (Centre National de Recherche) built with React, Go, and MongoDB.

## Features

- User authentication and authorization
- Payment processing
- Blockchain integration
- Notification system
- File management
- Real-time updates

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)
- Go (for local development)
- MongoDB (for local development)

## Project Structure

```
.
├── frontend/           # React frontend application
│   └── cnr/           # Main frontend code
├── backend/           # Go backend application
│   ├── api/          # API handlers
│   ├── feature/      # Business logic
│   ├── pkg/          # Shared packages
│   └── cmd/          # Application entry point
├── docker-compose.yml # Docker Compose configuration
└── README.md         # This file
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://mongodb:27017/cnr
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend



## Deployment

### Using Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd cnr-payment-blockchain
```

2. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the values in `.env` with your configuration

3. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MongoDB: mongodb://localhost:27017

### Local Development

#### Backend
```bash
cd backend
go mod download
go run cmd/main.go
```

#### Frontend
```bash
cd frontend/cnr
npm install
npm run dev
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Database

The application uses MongoDB as its primary database. The data is persisted using Docker volumes.

## Security

- JWT-based authentication
- Password hashing
- CORS configuration
- Rate limiting
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or open an issue in the repository.

</body>
</html>

