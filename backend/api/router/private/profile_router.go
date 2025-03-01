package private

import (
	"scps-backend/api/controller"
	"scps-backend/feature/home/profile/domain/repository"
	"scps-backend/feature/home/profile/usecase"

	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewGetProfileuRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-profile", ic.GetProfileRequest)
}

func NewUploadFileRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("upload-file", ic.UploadFileRequestt)
}

func NewGetFoldersRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-folders", ic.GetFoldersRequest)
}

func NewGetAllMetaDataFileRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-all-files-metadata", ic.GetAllFilesMetaDataRequest)
}
