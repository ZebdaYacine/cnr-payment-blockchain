package controller

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/pkg"
	util "scps-backend/util/token"
	"strings"

	"scps-backend/feature/home/file/domain/entities"
	"scps-backend/feature/home/file/usecase"

	"github.com/gin-gonic/gin"
	"github.com/pkg/sftp"
)

type FileController struct {
	FileUsecase usecase.FileUsecase
	SftpClient  *sftp.Client
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

// func (ic *FileController) DownloadFilesRequest(c *gin.Context) {
// 	log.Println("************************ DOWNLOAD FILE REQUEST ************************")

// 	var req entities.DownloadFile
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "Invalid request body",
// 			"status":  http.StatusBadRequest,
// 		})
// 		return
// 	}

// 	filesMap, err := ic.FileUsecase.DownloadFiles(c, req.Files)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": err.Error(),
// 			"status":  http.StatusInternalServerError,
// 		})
// 		return
// 	}

// 	var buffer bytes.Buffer
// 	zipWriter := zip.NewWriter(&buffer)

// 	for fileName, paths := range filesMap {
// 		baseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
// 		ext := filepath.Ext(fileName)

// 		if len(paths) == 1 {
// 			// 🔹 No versions — file in root of zip
// 			filePath := paths[0]
// 			file, err := os.Open(filePath)
// 			if err != nil {
// 				log.Printf("Failed to open file: %v", err)
// 				continue
// 			}
// 			defer file.Close()

// 			info, _ := file.Stat()
// 			header, _ := zip.FileInfoHeader(info)
// 			header.Name = filepath.Base(filePath) // keep name as-is
// 			header.Method = zip.Deflate

// 			writer, err := zipWriter.CreateHeader(header)
// 			if err != nil {
// 				log.Printf("Failed to create zip entry: %v", err)
// 				continue
// 			}
// 			io.Copy(writer, file)

// 		} else {
// 			// 🔹 Versions exist — create folder
// 			versionFolder := fmt.Sprintf("versions_of_%s", baseName)

// 			for i, filePath := range paths {
// 				file, err := os.Open(filePath)
// 				if err != nil {
// 					log.Printf("Failed to open file: %v", err)
// 					continue
// 				}
// 				defer file.Close()

// 				info, _ := file.Stat()
// 				header, _ := zip.FileInfoHeader(info)

// 				var nameInZip string
// 				if i == 0 {
// 					// original file
// 					nameInZip = fmt.Sprintf("%s", filepath.Base(filePath))
// 				} else {
// 					// versioned file
// 					nameInZip = fmt.Sprintf("%s/%s_v%d%s", versionFolder, baseName, i, ext)
// 				}

// 				header.Name = nameInZip
// 				header.Method = zip.Deflate

// 				writer, err := zipWriter.CreateHeader(header)
// 				if err != nil {
// 					log.Printf("Failed to create zip entry: %v", err)
// 					continue
// 				}
// 				io.Copy(writer, file)
// 			}
// 		}
// 	}

// 	zipWriter.Close()

// 	c.Header("Content-Disposition", "attachment; filename=files.zip")
// 	c.Data(http.StatusOK, "application/zip", buffer.Bytes())
// }

// func (ic *FileController) DownloadFilesOfFolderRequest(c *gin.Context) {
// 	log.Println("************************ DOWNLOAD FOLDER REQUEST ************************")

// 	var req struct {
// 		Folder string `json:"folder"`
// 	}
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{
// 			"message": "Invalid request body",
// 			"status":  http.StatusBadRequest,
// 		})
// 		return
// 	}

// 	filesMap, err := ic.FileUsecase.DownloadFilesOfFolder(c, req.Folder)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{
// 			"message": err.Error(),
// 			"status":  http.StatusInternalServerError,
// 		})
// 		return
// 	}

// 	var buffer bytes.Buffer
// 	zipWriter := zip.NewWriter(&buffer)

// 	for fileName, paths := range filesMap {
// 		baseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
// 		ext := filepath.Ext(fileName)
// 		if len(paths) == 1 {
// 			filePath := paths[0]
// 			file, err := os.Open(filePath)
// 			if err != nil {
// 				log.Printf("Failed to open file: %v", err)
// 				continue
// 			}
// 			defer file.Close()

// 			info, _ := file.Stat()
// 			header, _ := zip.FileInfoHeader(info)
// 			header.Name = filepath.Base(filePath)
// 			header.Method = zip.Deflate

// 			writer, err := zipWriter.CreateHeader(header)
// 			if err != nil {
// 				log.Printf("Failed to create zip entry: %v", err)
// 				continue
// 			}
// 			io.Copy(writer, file)

// 		} else {
// 			versionFolder := fmt.Sprintf("versions_of_%s", baseName)
// 			for i, filePath := range paths {
// 				file, err := os.Open(filePath)
// 				if err != nil {
// 					log.Printf("Failed to open file: %v", err)
// 					continue
// 				}
// 				defer file.Close()

// 				info, _ := file.Stat()
// 				header, _ := zip.FileInfoHeader(info)

// 				var nameInZip string
// 				if i == 0 {
// 					// original file
// 					nameInZip = fmt.Sprintf("%s", filepath.Base(filePath))
// 				} else {
// 					// versioned file
// 					nameInZip = fmt.Sprintf("%s/%s_v%d%s", versionFolder, baseName, i, ext)
// 				}

// 				header.Name = nameInZip
// 				header.Method = zip.Deflate

// 				writer, err := zipWriter.CreateHeader(header)
// 				if err != nil {
// 					log.Printf("Failed to create zip entry: %v", err)
// 					continue
// 				}
// 				io.Copy(writer, file)
// 			}
// 		}
// 	}

// 	zipWriter.Close()

// 	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.zip", filepath.Base(req.Folder)))
// 	c.Data(http.StatusOK, "application/zip", buffer.Bytes())
// }

func (ic *FileController) DownloadFilesOfFolderRequest(c *gin.Context) {
	log.Println("************************ DOWNLOAD FOLDER REQUEST ************************")

	var req struct {
		Folder string `json:"folder"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"status":  http.StatusBadRequest,
		})
		return
	}

	filesMap, err := ic.FileUsecase.DownloadFilesOfFolder(c, req.Folder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  http.StatusInternalServerError,
		})
		return
	}

	log.Println(">>>>>>>>>>>>>>>>", filesMap)

	var buffer bytes.Buffer
	zipWriter := zip.NewWriter(&buffer)

	for fileName, paths := range filesMap {
		baseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
		ext := filepath.Ext(fileName)

		if len(paths) == 1 {
			// No versions
			filePath := paths[0]

			remoteFile, err := ic.SftpClient.Open(filePath)
			if err != nil {
				log.Printf("Failed to open file from SFTP: %v", err)
				continue
			}

			info, err := remoteFile.Stat()
			if err != nil {
				log.Printf("Failed to stat remote file: %v", err)
				remoteFile.Close()
				continue
			}

			header, err := zip.FileInfoHeader(info)
			if err != nil {
				log.Printf("Failed to create zip header: %v", err)
				remoteFile.Close()
				continue
			}
			header.Name = filepath.Base(filePath)
			header.Method = zip.Deflate

			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				log.Printf("Failed to create zip entry: %v", err)
				remoteFile.Close()
				continue
			}

			_, err = io.Copy(writer, remoteFile)
			if err != nil {
				log.Printf("Failed to copy file into zip: %v", err)
			}

			remoteFile.Close()

		} else {
			// Multiple versions
			versionFolder := fmt.Sprintf("versions_of_%s", baseName)

			for i, filePath := range paths {
				remoteFile, err := ic.SftpClient.Open(filePath)
				if err != nil {
					log.Printf("Failed to open versioned file from SFTP: %v", err)
					continue
				}

				info, err := remoteFile.Stat()
				if err != nil {
					log.Printf("Failed to stat remote versioned file: %v", err)
					remoteFile.Close()
					continue
				}

				header, err := zip.FileInfoHeader(info)
				if err != nil {
					log.Printf("Failed to create zip header: %v", err)
					remoteFile.Close()
					continue
				}

				var nameInZip string
				if i == 0 {
					nameInZip = fmt.Sprintf("%s", filepath.Base(filePath))
				} else {
					nameInZip = fmt.Sprintf("%s/%s_v%d%s", versionFolder, baseName, i, ext)
				}

				header.Name = nameInZip
				header.Method = zip.Deflate

				writer, err := zipWriter.CreateHeader(header)
				if err != nil {
					log.Printf("Failed to create zip entry for versioned file: %v", err)
					remoteFile.Close()
					continue
				}

				_, err = io.Copy(writer, remoteFile)
				if err != nil {
					log.Printf("Failed to copy versioned file into zip: %v", err)
				}

				remoteFile.Close()
			}
		}
	}

	zipWriter.Close()

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.zip", filepath.Base(req.Folder)))
	c.Data(http.StatusOK, "application/zip", buffer.Bytes())
}

func (ic *FileController) DownloadFilesRequest(c *gin.Context) {
	log.Println("************************ DOWNLOAD FILE REQUEST ************************")

	var req entities.DownloadFile
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"status":  http.StatusBadRequest,
		})
		return
	}
	filesMap, err := ic.FileUsecase.DownloadFiles(c, req.Files)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"status":  http.StatusInternalServerError,
		})
		return
	}

	var buffer bytes.Buffer
	zipWriter := zip.NewWriter(&buffer)

	for fileName, paths := range filesMap {
		baseName := strings.TrimSuffix(fileName, filepath.Ext(fileName))
		ext := filepath.Ext(fileName)

		if len(paths) == 1 {
			//  No versions — file in root of zip
			filePath := paths[0]
			remoteFile, err := ic.SftpClient.Open(filePath)
			if err != nil {
				log.Panic("Failed to open file from SFTP: %v", err)
				continue
			}
			info, err := remoteFile.Stat()
			if err != nil {
				log.Printf("Failed to stat remote file: %v", err)
				remoteFile.Close()
				continue
			}

			header, err := zip.FileInfoHeader(info)
			if err != nil {
				log.Panic("Failed to create zip header: %v", err)
				remoteFile.Close()
				continue
			}
			header.Name = filepath.Base(filePath)
			header.Method = zip.Deflate

			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				log.Panic("Failed to create zip entry: %v", err)
				remoteFile.Close()
				continue
			}

			_, err = io.Copy(writer, remoteFile)
			if err != nil {
				log.Panic("Failed to copy file into zip: %v", err)
			}

			remoteFile.Close()

		} else {
			//  Versions exist — create folder
			versionFolder := fmt.Sprintf("versions_of_%s", baseName)

			for i, filePath := range paths {
				remoteFile, err := ic.SftpClient.Open(filePath)
				if err != nil {
					log.Printf("Failed to open versioned file from SFTP: %v", err)
					continue
				}
				info, err := remoteFile.Stat()
				if err != nil {
					log.Printf("Failed to stat remote file: %v", err)
					remoteFile.Close()
					continue
				}

				header, err := zip.FileInfoHeader(info)
				if err != nil {
					log.Printf("Failed to create zip header: %v", err)
					remoteFile.Close()
					continue
				}

				var nameInZip string
				if i == 0 {
					nameInZip = fmt.Sprintf("%s", filepath.Base(filePath))
				} else {
					nameInZip = fmt.Sprintf("%s/%s_v%d%s", versionFolder, baseName, i, ext)
				}

				header.Name = nameInZip
				header.Method = zip.Deflate

				writer, err := zipWriter.CreateHeader(header)
				if err != nil {
					log.Printf("Failed to create zip entry: %v", err)
					remoteFile.Close()
					continue
				}

				_, err = io.Copy(writer, remoteFile)
				if err != nil {
					log.Printf("Failed to copy versioned file into zip: %v", err)
				}

				remoteFile.Close()
			}
		}
	}

	zipWriter.Close()

	c.Header("Content-Disposition", "attachment; filename=files.zip")
	c.Data(http.StatusOK, "application/zip", buffer.Bytes())
}
