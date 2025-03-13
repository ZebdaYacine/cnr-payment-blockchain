package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"

	"scps-backend/feature/home/profile/usecase"

	"github.com/gin-gonic/gin"
)

type ProfileController struct {
	ProfileUsecase usecase.ProfileUsecase
}

func (ic *ProfileController) GetProfileRequest(c *gin.Context) {
	log.Println("************************ GET PROFILE REQUEST ************************")
	userId := core.GetIdUser(c)
	profileParams := &usecase.ProfileParams{}
	profileParams.Data = userId
	resulat := ic.ProfileUsecase.GetProfile(c, profileParams)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET PROFILE SUCCESSFULY",
		Data:    resulat.Data,
	})
}

func (ic *ProfileController) GetFoldersRequest(c *gin.Context) {
	log.Println("************************ GET FOLDERS REQUEST ************************")
	resulat := ic.ProfileUsecase.GetFolders(c)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET FOLDERS SUCCESSFULY",
		Data:    resulat.Data,
	})
}
