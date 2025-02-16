package private

import (
	"scps-backend/api/controller"
	versionRepo "scps-backend/feature/home/version/domain/repository"
	versionUsecase "scps-backend/feature/home/version/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewUploadVersionRouter(db database.Database, group *gin.RouterGroup) {
	ir := versionRepo.NewVersionRepository(db)
	uc := versionUsecase.NewVersionUsecase(ir, "")
	ic := &controller.VersionController{
		VersionUsecase: uc,
	}
	group.POST("upload-veriosn", ic.UploadVersionRequestt)
}
