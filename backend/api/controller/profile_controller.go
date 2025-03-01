package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/pkg"
	util "scps-backend/util/token"

	"scps-backend/feature/home/profile/domain/entities"
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

func (ic *ProfileController) UploadFileRequestt(c *gin.Context) {
	log.Println("************************ UPLOAD FILE REQUEST ************************")
	var uploadFile entities.UploadFile
	if !core.IsDataRequestSupported(&uploadFile, c) {
		return
	}
	token := util.GetToken(c)
	userid, err := util.ExtractIDFromToken(token, pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY)
	if err != nil {
		c.JSON(http.StatusNonAuthoritativeInfo, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	uploadFile.UserId = userid
	log.Println("FILE UPLOADED :", uploadFile)
	profileParams := &usecase.ProfileParams{}
	profileParams.Data = uploadFile
	resulat := ic.ProfileUsecase.UploadFile(c, profileParams)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "UPLOAD FILE SUCCESSFULY",
		Data:    resulat.Data,
	})
}

func (ic *ProfileController) GetAllFilesMetaDataRequest(c *gin.Context) {
	log.Println("************************ GET ALL META DATA FILES REQUEST ************************")
	resulat := ic.ProfileUsecase.GetMetaDataFile(c)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET ALL META DATA FILES WAS SUCCESSFULY",
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
