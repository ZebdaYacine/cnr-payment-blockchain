package private

import (
	"scps-backend/api/controller"
	dashboardRepo "scps-backend/feature/dashboard/domain/repository"
	dashbordUsecase "scps-backend/feature/dashboard/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewUploadingFilesVersionPKIRouter(db database.Database, group *gin.RouterGroup) {
	ir := dashboardRepo.NewDashboardRepository(db)
	uc := dashbordUsecase.NewDashboardUsecase(&ir)
	ic := &controller.DashboardController{
		DashboardUsecase: uc,
	}
	group.GET("get-PKI1", ic.GetUploadingFilesVersionPKI)
	group.GET("get-hacking-try-pki", ic.GetHackingTryPKI)
	group.GET("get-workers-error-rate", ic.GetWorkersErrorRate)
}
