package servers

import (
	"log"
	"scps-backend/api/router"
	"scps-backend/core"
	"scps-backend/pkg"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func InitServer(db database.Database, ServerName string) {
	switch ServerName {
	case core.GIN:
		Gin(db)
	case core.ECHO:
		Echo(db)
	case core.FIVER:
		Echo(db)
	default:
		log.Fatalf("Unsupported server name: %s", ServerName)
	}
}

func Gin(db database.Database) {
	server := gin.Default()
	sftpClient, err := ConnectSFTP()

	router.Setup(db, server)
	// cert, key := pkg.Get_TLS_Paths()
	// err := server.RunTLS(pkg.Get_URL(), cert, key)
	err = server.Run(pkg.Get_URL())
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
		return
	}
}

func Echo(db database.Database) {
	panic("Unmplemented")
}

func Fiver(db database.Database) {
	panic("Unmplemented")
}
