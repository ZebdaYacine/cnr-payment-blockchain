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
	private.NewGetVersionRouter(db, userRouter)
	private.NewGetInstitutionRouter(db, userRouter)
	private.NewGetChildOfInstitutiosRouter(db, userRouter)
	private.NewBringsUsersRouter(db, userRouter)
	private.NewAddNotificationRouter(db, userRouter)
	private.NewGetNotificationsRouter(db, userRouter)
	private.NewGetCurrentPhaseRouter(db, userRouter)
	private.NewDownLoadRouter(db, userRouter)
	private.NewDownLoadFolderRouter(db, userRouter)
	private.NewAddPKRouter(db, userRouter)
	private.NewUpdateFirstLastNameRouter(db, userRouter)
	private.NewUpdatePasswordRouter(db, userRouter)

	// Superuser-specific routes with middleware
	adminRouter := gin.Group("/admin")
	adminRouter.Use(middleware.JwtAuthMiddleware(
		pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY,
		"ADMIN"))
	private.NewGetProfileuRouter(db, adminRouter)
	private.NewGetFoldersRouter(db, adminRouter)
	private.NewUploadFileRouter(db, adminRouter)
	private.NewGetAllMetaDataFileRouter(db, adminRouter)
	private.NewUploadVersionRouter(db, adminRouter)
	private.NewGetInstitutionRouter(db, adminRouter)
	private.NewGetChildOfInstitutiosRouter(db, adminRouter)
	private.NewBringsUsersRouter(db, adminRouter)
	private.NewGetVersionRouter(db, adminRouter)
	private.NewAddNotificationRouter(db, adminRouter)
	private.NewGetNotificationsRouter(db, adminRouter)
	private.NewGetCurrentPhaseRouter(db, adminRouter)
	private.NewDownLoadRouter(db, adminRouter)
	private.NewDownLoadFolderRouter(db, adminRouter)
	private.NewAddPKRouter(db, adminRouter)
	private.NewUpdateFirstLastNameRouter(db, adminRouter)
	private.NewUpdatePasswordRouter(db, adminRouter)

}
