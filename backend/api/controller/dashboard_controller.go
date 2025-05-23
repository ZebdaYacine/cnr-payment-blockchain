package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"

	"scps-backend/feature/dashboard/usecase"

	"github.com/gin-gonic/gin"
)

type DashboardController struct {
	DashboardUsecase usecase.DashboardUsecase
}

func (ic *DashboardController) GetUploadingFilesVersionPKI(c *gin.Context) {
	log.Println("************************ GET DASHBOARD PKI1  REQUEST ************************")

	// token := util.GetToken(c)
	// userid, err := util.ExtractIDFromToken(token, pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY)

	// if err != nil {
	// 	c.JSON(http.StatusNonAuthoritativeInfo, model.ErrorResponse{
	// 		Message: err.Error(),
	// 	})
	// 	return
	// }
	resulat := ic.DashboardUsecase.UploadingFilesVersionPKI(c)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET DASHBOARD PKI1 SUCCESSFULY",
		Data:    resulat.Data,
	})
}
