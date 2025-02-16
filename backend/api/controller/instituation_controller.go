package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"

	"scps-backend/feature/home/institutions/usecase"

	"github.com/gin-gonic/gin"
)

type InstitutionsController struct {
	InstituationsUsecase usecase.InstituationsUsecase
}

// HANDLE WITH LOGIN ACCOUNT REQUEST
func (ic *InstitutionsController) GetInstitutionsRequest(c *gin.Context) {
	log.Println("************************ GET INSTITUTIONS REQUEST ************************")
	resulat := ic.InstituationsUsecase.GetInstitutions(c)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET INSTITUTIONS SUCCESSFULY",
		Data:    resulat.Data,
	})
}

func (ic *InstitutionsController) GetChildInstitutionsRequest(c *gin.Context) {
	log.Println("************************ GET CHILD OF INSTITUTIONS REQUEST ************************")

	// Extract `id` from query parameters (GET /institutions/children?id=123)
	institutionID := c.Query("id")

	// If not found in query, try extracting from URL parameters (GET /institutions/:id/children)
	if institutionID == "" {
		institutionID = c.Param("id")
	}

	// Ensure institution ID is provided
	if institutionID == "" {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: "Missing institution ID",
		})
		return
	}

	// Fetch child institutions
	result := ic.InstituationsUsecase.GetChildOfInstitutions(c, institutionID)
	if err := result.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET CHILD OF INSTITUTIONS SUCCESSFULY",
		Data:    result.Data,
	})
}
