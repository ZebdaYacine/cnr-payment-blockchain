package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"

	"github.com/gin-gonic/gin"
)

type PingController struct {
}

// HANDLE WITH LOGIN ACCOUNT REQUEST
func (ic *PingController) PingRequest(c *gin.Context) {
	log.Println("************************ RECIEVE PING REQUEST ************************")

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "SCPC API PING SUCCESSFUL",
		Data:    "HEY HOW CAN I HELP YOU SIR?",
	})

}
