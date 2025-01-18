package public

import (
	"scps-backend/api/controller"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewPingRouter(db database.Database, group *gin.RouterGroup) {
	ic := &controller.PingController{}
	group.GET("ping", ic.PingRequest)
}
