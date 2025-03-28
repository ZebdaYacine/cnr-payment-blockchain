package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/fabric"

	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/feature/home/profile/usecase"

	"github.com/gin-gonic/gin"
)

type ProfileController struct {
	ProfileUsecase usecase.ProfileUsecase
}

type AddPKRequest struct {
	PK string `json:"pk" binding:"required"`
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

	// ✅ Extract query parameters safely
	receiverId := c.Query("receiverId")
	senderId := c.Query("senderId")

	// ✅ Validate input (both parameters are required)
	if receiverId == "" {
		log.Println("🚨 Missing required parameter: receiverId")
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Missing required parameter: receiverId ",
		})
		return
	}

	folder := &fabric.FolderMetadata{
		ReciverId: receiverId,
		UserId:    senderId,
	}

	log.Printf("📂 Fetching folders for Organisation: %s, Destination: %s\n", folder.Organisation, folder.Destination)

	// ✅ Call use case to get folders
	resulat := ic.ProfileUsecase.GetFolders(c, folder)

	// ✅ Handle errors from use case
	if err := resulat.Err; err != nil {
		log.Println("🚨 Error retrieving folders:", err)
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	// ✅ Check if no folders were found
	folders, ok := resulat.Data.(*[]entities.Folder)
	if !ok || folders == nil || len(*folders) == 0 {
		log.Println("⚠️ No folders found for the given criteria.")
		c.JSON(http.StatusOK, model.SuccessResponse{
			Message: "No folders found",
			Data:    []interface{}{}, // ✅ Return empty array instead of nil
		})
		return
	}

	// ✅ Success response
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET FOLDERS SUCCESSFULLY",
		Data:    resulat.Data,
	})
}

func (ic *ProfileController) GetCurrentPhaseRequest(c *gin.Context) {
	log.Println("************************ GET CURRENT PHASE REQUEST ************************")

	result := ic.ProfileUsecase.GetCurrentPhase(c)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET CURRENT PHASE SUCCESSFULLY",
		Data:    result.Data,
	})
}

func (ic *ProfileController) AddPKRequest(c *gin.Context) {
	log.Println("************************ ADD PK REQUEST ************************")

	var req AddPKRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Invalid request body",
		})
		return
	}
	userId := core.GetIdUser(c)
	result := ic.ProfileUsecase.AddPK(c, userId, req.PK)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "Public key added successfully",
		Data:    result.Data,
	})
}
