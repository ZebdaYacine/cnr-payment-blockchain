FROM golang:1.22.0 AS builder

WORKDIR /usr/src/app


COPY go.mod go.sum  ./

RUN go mod download
RUN go mod tidy

COPY . ./

COPY .env ./

# RUN go build -o main cmd/main.go

# FROM alpine:latest

# WORKDIR /app

EXPOSE 3000
#RUN go run cmd/main.go
#ENTRYPOINT [ "/app/main" ]
CMD ["go","run","cmd/main.go"]