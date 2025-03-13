package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/pkg"
	util "scps-backend/util/token"

	"scps-backend/feature/home/file/domain/entities"
	"scps-backend/feature/home/file/usecase"

	"github.com/gin-gonic/gin"
)

type FileController struct {
	FileUsecase usecase.FileUsecase
}

func (ic *FileController) UploadFileRequestt(c *gin.Context) {
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
	profileParams := &usecase.FileParams{}
	profileParams.Data = uploadFile
	resulat := ic.FileUsecase.UploadFile(c, profileParams)
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

func (ic *FileController) GetAllFilesMetaDataByFolderNameRequest(c *gin.Context) {
	log.Println("************************ GET ALL META DATA FILES BY FOLDER NAME REQUEST ************************")
	foldername := c.Query("folder")
	resulat := ic.FileUsecase.GetMetaDataFileByFolderName(c, foldername)
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
