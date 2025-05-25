# Build stage
FROM golang:1.23 AS builder 

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application from cmd folder
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

# Production stage
FROM debian:bullseye-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates tzdata && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 appuser

# Create necessary directories for Fabric
RUN mkdir -p /app/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls

# Copy binary and configuration from builder
COPY --from=builder --chown=appuser:appuser /app/main .
COPY --from=builder --chown=appuser:appuser /app/.env .  

# Copy Fabric certificates (adjust paths as needed)
COPY --from=builder --chown=appuser:appuser /app/fabric-samples /app/fabric-samples

# Set proper permissions
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3000


# Run the application
ENTRYPOINT ["./main"]