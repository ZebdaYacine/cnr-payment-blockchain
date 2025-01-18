package public

import (
	"scps-backend/api/controller"
	"scps-backend/core"
	"scps-backend/feature/auth/domain/repository"

	"scps-backend/feature/auth/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewCreateAccountRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewAuthRepository(db)
	uc := usecase.NewAuthUsecase(ir, core.USER)
	ic := &controller.AuthController{
		AuthUsecase: uc, // usecase for insured operations
	}
	group.POST("create-account", ic.CreateAccountRequest)
}
func NewLoginRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewAuthRepository(db)
	uc := usecase.NewAuthUsecase(ir, core.USER)
	ic := &controller.AuthController{
		AuthUsecase: uc, // usecase for insured operations
	}
	group.POST("login", ic.LoginRequest)
}

func NewRecieveEmailRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewAuthRepository(db)
	uc := usecase.NewAuthUsecase(ir, core.USER)
	ic := &controller.AuthController{
		AuthUsecase: uc, // usecase for insured operations
	}
	group.POST("set-email", ic.SetEmailRequest)
}

func NewRecieveOTPRouter(group *gin.RouterGroup) {
	ic := &controller.AuthController{
		AuthUsecase: nil, // usecase for insured operations
	}
	group.POST("confirm-otp", ic.ReciveOTPRequest)
}

func NewForgetPwdRouter(db database.Database, group *gin.RouterGroup) {
	ir := repository.NewAuthRepository(db)
	uc := usecase.NewAuthUsecase(ir, core.USER)
	ic := &controller.AuthController{
		AuthUsecase: uc, // usecase for insured operations
	}
	group.POST("forget-password", ic.ForgetPwdRequest)
}
