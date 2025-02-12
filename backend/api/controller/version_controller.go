package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/pkg"
	util "scps-backend/util/token"

	"scps-backend/feature/version/domain/entities"
	"scps-backend/feature/version/usecase"

	"github.com/gin-gonic/gin"
)

type VersionController struct {
	VersionUsecase usecase.VersionUsecase
}

func (ic *VersionController) UploadVersionRequestt(c *gin.Context) {
	log.Println("************************ UPLOAD VERSION REQUEST ************************")
	var uploadFile entities.UploadVersion
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
	versionParams := &usecase.VersionParams{}
	versionParams.Data = uploadFile
	resulat := ic.VersionUsecase.UploadVersion(c, versionParams)
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
