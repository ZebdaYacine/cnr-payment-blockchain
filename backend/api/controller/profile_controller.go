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

type UpdateFirstLastNameRequest struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type UpdatePasswordRequest struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

type VerifyDigitalSignatureRequest struct {
	Signature   string `json:"signature" binding:"required"`
	RandomValue string `json:"randomValue" binding:"required"`
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

	receiverId := c.Query("receiverId")
	senderId := c.Query("senderId")

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

	resulat := ic.ProfileUsecase.GetFolders(c, folder)

	if err := resulat.Err; err != nil {
		log.Println("🚨 Error retrieving folders:", err)
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	folders, ok := resulat.Data.(*[]entities.Folder)
	if !ok || folders == nil || len(*folders) == 0 {
		log.Println("⚠️ No folders found for the given criteria.")
		c.JSON(http.StatusOK, model.SuccessResponse{
			Message: "No folders found",
			Data:    []interface{}{}, // 
		})
		return
	}

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

func (ic *ProfileController) UpdateFirstLastNameRequest(c *gin.Context) {
	log.Println("************************ UPDATE FIRST LAST NAME REQUEST ************************")

	var req UpdateFirstLastNameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Invalid request body",
		})
		return
	}
	userId := core.GetIdUser(c)
	result := ic.ProfileUsecase.UpdateFirstLastName(c, userId, req.FirstName, req.LastName)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "User name updated successfully",
		Data:    result.Data,
	})
}

func (ic *ProfileController) UpdatePasswordRequest(c *gin.Context) {
	log.Println("************************ UPDATE PASSWORD REQUEST ************************")

	var req UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Invalid request body",
		})
		return
	}
	userId := core.GetIdUser(c)
	result := ic.ProfileUsecase.UpdatePassword(c, userId, req.OldPassword, req.NewPassword)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "Password updated successfully",
		Data:    result.Data,
	})
}

func (ic *ProfileController) VerifyDigitalSignature(c *gin.Context) {
	log.Println("🔐 VerifyDigitalSignature API called")

	var req VerifyDigitalSignatureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Invalid request body",
		})
		return
	}

	userId := core.GetIdUser(c)

	isValid := ic.ProfileUsecase.VerifyDigitalSignature(
		c,
		userId,
		req.Signature,
		req.RandomValue,
	)

	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "Signature verified",
		Data:    isValid,
	})
}
