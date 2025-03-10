package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"

	"scps-backend/feature/home/institutions/usecase"

	"github.com/gin-gonic/gin"
)

type InstitutionsController struct {
	InstituationsUsecase usecase.InstituationsUsecase
}

// HANDLE WITH LOGIN ACCOUNT REQUEST
func (ic *InstitutionsController) GetInstitutionsRequest(c *gin.Context) {
}

func (ic *InstitutionsController) GetUsersRequest(c *gin.Context) {
	log.Println("************************ GET USERS REQUEST ************************")
	userId := core.GetIdUser(c)
	resulat := ic.InstituationsUsecase.BringCalandVal(c, userId)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET USERS SUCCESSFULY",
		Data:    resulat.Data,
	})
}

func (ic *InstitutionsController) GetChildInstitutionsRequest(c *gin.Context) {
	log.Println("************************ GET CHILD OF INSTITUTIONS REQUEST ************************")
	institutionID := c.Query("id")
	institutionName := c.Query("workAt")
	if institutionID == "" {
		institutionID = c.Param("id")
	}
	if institutionName == "" {
		institutionName = c.Param("workAt")
	}
	if institutionID == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Missing institution ID",
		})
		return
	}
	if institutionName == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Missing institution Name",
		})
		return
	}
	userId := core.GetIdUser(c)
	result := ic.InstituationsUsecase.GetPeers(c, institutionName, institutionID, userId)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET CHILD OF INSTITUTIONS SUCCESSFULY",
		Data:    result.Data,
	})
}
