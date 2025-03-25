package controller

import (
	"archive/zip"
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
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
func (ic *FileController) DownloadFilesRequest(c *gin.Context) {
	log.Println("************************ DOWNLOAD FILE  REQUEST ************************")

	var req entities.DownloadFile
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"status":  http.StatusBadRequest,
		})
		return
	}

	files, err := ic.FileUsecase.DownloadFiles(c, req.Files)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  http.StatusInternalServerError,
		})
		return
	}

	var buffer bytes.Buffer
	zipWriter := zip.NewWriter(&buffer)

	for _, filePath := range files {
		file, err := os.Open(filePath)
		if err != nil {
			continue
		}
		defer file.Close()

		info, _ := file.Stat()
		header, _ := zip.FileInfoHeader(info)
		header.Name = filepath.Base(filePath)

		writer, _ := zipWriter.CreateHeader(header)
		io.Copy(writer, file)
	}
	zipWriter.Close()

	c.Header("Content-Disposition", "attachment; filename=files.zip")
	c.Data(http.StatusOK, "application/zip", buffer.Bytes())
}
