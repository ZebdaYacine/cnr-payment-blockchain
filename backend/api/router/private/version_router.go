package private

import (
	"scps-backend/api/controller"
	versionRepo "scps-backend/feature/home/version/domain/repository"
	versionUsecase "scps-backend/feature/home/version/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/pkg/sftp"
)

func NewUploadVersionRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := versionRepo.NewVersionRepository(db, sftpClient)
	uc := versionUsecase.NewVersionUsecase(ir, "")
	ic := &controller.VersionController{
		VersionUsecase: uc,
	}
	group.POST("upload-version", ic.UploadVersionRequestt)
}

func NewGetVersionRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := versionRepo.NewVersionRepository(db, sftpClient)
	uc := versionUsecase.NewVersionUsecase(ir, "")
	ic := &controller.VersionController{
		VersionUsecase: uc,
	}
	group.GET("get-versions", ic.GetVersionRequestt)
}
