package private

import (
	"scps-backend/api/controller"
	"scps-backend/feature/home/institutions/domain/repository"
	"scps-backend/feature/home/institutions/usecase"

	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewGetInstitutionRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewInstitutionsRepository(db)
	uc := usecase.NewInstitutionsUsecase(ir, "")
	ic := &controller.InstitutionsController{
		InstituationsUsecase: uc,
	}
	group.GET("get-institutions", ic.GetInstitutionsRequest)
}

func NewGetChildOfInstitutiosRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewInstitutionsRepository(db)
	uc := usecase.NewInstitutionsUsecase(ir, "")
	ic := &controller.InstitutionsController{
		InstituationsUsecase: uc,
	}
	group.GET("get-child-institutions", ic.GetChildInstitutionsRequest)
}

func NewBringsUsersRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewInstitutionsRepository(db)
	uc := usecase.NewInstitutionsUsecase(ir, "")
	ic := &controller.InstitutionsController{
		InstituationsUsecase: uc,
	}
	group.GET("bring-users", ic.GetUsersRequest)
}
