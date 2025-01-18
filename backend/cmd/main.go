package main

import (
	"scps-backend/api/servers"
	"scps-backend/core"
	"scps-backend/pkg/database"
)

func main() {
	db := database.ConnectionDb()
	servers.InitServer(db, core.GIN)
}
