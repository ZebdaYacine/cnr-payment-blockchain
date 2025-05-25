package pkg

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil || !os.IsNotExist(err)
}
func LoadEnv() {

	// err := godotenv.Load("../.env")
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Warning: .env file not found; using environment variables")
	}
}

type DB_SERVER struct {
	USER_DB           string
	PASSWORD_DB       string
	SERVER_ADDRESS_DB string
	DB_NAME           string
}

type ROOT_SERVER struct {
	SERVER_ADDRESS string
	SERVER_PORT    string
	SECRET_KEY     string
}

type SMTP_SERVER struct {
	SMTP_HOST string
	SMTP_PORT int
	SMTP_USER string
	SMTP_PASS string
}

type BLOCK_CHAIN struct {
	CHANNEL_NAME string
	CHAIN_CODE   string
}

type SFTP struct {
	SFTP_HOST string
	SFTP_USER string
	SFTP_PASS string
}

func GET_SFTP_SETTING() SFTP {
	LoadEnv()
	return SFTP{
		SFTP_HOST: os.Getenv("SFTP_HOST"),
		SFTP_USER: os.Getenv("SFTP_USER"),
		SFTP_PASS: os.Getenv("SFTP_PASS"),
	}
}

func GET_ROOT_SERVER_SETTING() ROOT_SERVER {
	LoadEnv()
	return ROOT_SERVER{
		SERVER_ADDRESS: os.Getenv("SERVER_ADDRESS"),
		SERVER_PORT:    os.Getenv("PORT"),
		SECRET_KEY:     os.Getenv("SECRET_KEY"),
	}
}

func GET_DB_SERVER_SETTING() DB_SERVER {
	LoadEnv()

	// Get database settings
	dbSettings := DB_SERVER{
		USER_DB:           os.Getenv("USER_DB"),
		PASSWORD_DB:       os.Getenv("PASSWORD_DB"),
		SERVER_ADDRESS_DB: os.Getenv("SERVER_ADDRESS_DB"),
		DB_NAME:           os.Getenv("DB_NAME"),
	}

	// Validate required settings
	if dbSettings.SERVER_ADDRESS_DB == "" {
		log.Fatal("SERVER_ADDRESS_DB environment variable is not set")
	}
	if dbSettings.DB_NAME == "" {
		log.Fatal("DB_NAME environment variable is not set")
	}

	log.Printf("Database settings loaded - Server: %s, Database: %s",
		dbSettings.SERVER_ADDRESS_DB, dbSettings.DB_NAME)

	return dbSettings
}

func GET_SMTP_SERVER_SETTING() SMTP_SERVER {
	LoadEnv()
	PORT, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		PORT = 587
	}
	return SMTP_SERVER{
		SMTP_HOST: os.Getenv("SMTP_HOST"),
		SMTP_PORT: PORT,
		SMTP_USER: os.Getenv("SMTP_USER"),
		SMTP_PASS: os.Getenv("SMTP_PASS"),
	}
}

func Get_URL() string {
	LoadEnv()
	url := fmt.Sprintf("%s:%s", os.Getenv("SERVER_ADDRESS"), os.Getenv("SERVER_PORT"))
	return url
}
func GET_BLOCKCHAIN_SETTING() BLOCK_CHAIN {
	LoadEnv()
	return BLOCK_CHAIN{
		CHANNEL_NAME: os.Getenv("CHANNEL_NAME"),
		CHAIN_CODE:   os.Getenv("CHAIN_CODE"),
	}
}

func Is_TLS_Enabled() bool {
	LoadEnv()
	return os.Getenv("USE_TLS") == "true"
}

func Get_TLS_Paths() (cert string, key string) {
	LoadEnv()
	return os.Getenv("TLS_CERT_PATH"), os.Getenv("TLS_KEY_PATH")
}
