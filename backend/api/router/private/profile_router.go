package private

import (
	"scps-backend/api/controller"
	"scps-backend/feature/home/profile/domain/repository"
	"scps-backend/feature/home/profile/usecase"

	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewGetProfileSuRouter(db database.Database, group *gin.RouterGroup) {
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

func NewGetProfileRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-profile", ic.GetProfileRequest)
}

func NewGetInformationsCardRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("get-information-card", ic.GetInformationProfileRequest)
}

func NewSendDemandRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("send-demand", ic.SendDemandRequest)
}

func NewGetAllMetaDataFileRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-all-files-metadata", ic.GetAllFilesMetaDataRequest)
}

func NewUpdateDemandRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewProfileRepository(db)
	uc := usecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("update-demand", ic.UpdateDemandRequestt)
}
