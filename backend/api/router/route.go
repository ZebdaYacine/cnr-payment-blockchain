package router

import (
	"scps-backend/api/controller/middleware"
	"scps-backend/api/router/private"
	"scps-backend/api/router/public"
	"scps-backend/pkg"

	"scps-backend/pkg/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Setup(db database.Database, gin *gin.Engine) {

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"} // Change to your Flutter web app's URL
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	gin.Use(cors.New(config))

	publicRouter := gin.Group("/")
	public.NewCreateAccountRouter(db, publicRouter)
	public.NewPingRouter(db, publicRouter)
	public.NewLoginRouter(db, publicRouter)
	public.NewRecieveEmailRouter(db, publicRouter)
	public.NewRecieveOTPRouter(publicRouter)
	public.NewForgetPwdRouter(db, publicRouter)

	// User-specific routes with middleware
	userRouter := gin.Group("/user")
	userRouter.Use(middleware.JwtAuthMiddleware(
		pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY,
		"USER"))
	private.NewGetProfileuRouter(db, userRouter)
	private.NewGetFoldersRouter(db, userRouter)
	private.NewUploadFileRouter(db, userRouter)
	private.NewGetAllMetaDataFileRouter(db, userRouter)
	private.NewUploadVersionRouter(db, userRouter)
	private.NewGetInstitutionRouter(db, userRouter)
	private.NewGetChildOfInstitutiosRouter(db, userRouter)
	private.NewBringsUsersRouter(db, userRouter)

	// Superuser-specific routes with middleware
	superuserRouter := gin.Group("/super-user")
	superuserRouter.Use(middleware.JwtAuthMiddleware(
		pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY,
		"SUPER-USER"))
	private.NewGetProfileuRouter(db, superuserRouter)

}
