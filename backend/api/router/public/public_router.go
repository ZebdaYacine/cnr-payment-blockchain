package public

import (
	"github.com/gin-gonic/gin"
	"github.com/your-project/database"
	"github.com/your-project/user/controller"
)

func NewForgetPwdRouter(db database.Database, group *gin.RouterGroup) {
	ir := userrepo.NewUserRepository(db)
	uc := userusecase.NewUserUsecase(ir, "")
	ic := &controller.UserController{
		UserUsecase: uc,
	}
	group.POST("forget-password", ic.ForgetPasswordRequest)
}

func NewLogoutRouter(group *gin.RouterGroup) {
	ic := &controller.UserController{}
	group.POST("logout", ic.LogoutRequest)
}
