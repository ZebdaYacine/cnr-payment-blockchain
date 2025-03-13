package private

import (
	"scps-backend/api/controller"
	filerepo "scps-backend/feature/home/file/domain/repository"
	fileusecase "scps-backend/feature/home/file/usecase"
	profilerepo "scps-backend/feature/home/profile/domain/repository"
	profileusecase "scps-backend/feature/home/profile/usecase"

	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewGetProfileuRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-profile", ic.GetProfileRequest)
}

func NewUploadFileRouter(db database.Database, group *gin.RouterGroup) {
	ir := filerepo.NewFileRepository(db)
	uc := fileusecase.NewFileUsecase(ir, "")
	ic := &controller.FileController{
		FileUsecase: uc,
	}
	group.POST("upload-file", ic.UploadFileRequestt)
}

func NewGetFoldersRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-folders", ic.GetFoldersRequest)
}

func NewGetAllMetaDataFileRouter(db database.Database, group *gin.RouterGroup) {
	ir := filerepo.NewFileRepository(db)
	uc := fileusecase.NewFileUsecase(ir, "")
	ic := &controller.FileController{
		FileUsecase: uc,
	}
	group.GET("get-all-files-metadata", ic.GetAllFilesMetaDataByFolderNameRequest)
}
