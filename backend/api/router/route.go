package router

import (
	"scps-backend/api/controller/middleware"
	"scps-backend/api/router/private"
	"scps-backend/api/router/public"
	"scps-backend/pkg"

	"scps-backend/pkg/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/pkg/sftp"
)

func Setup(db database.Database, gin *gin.Engine, sftpClient *sftp.Client) {

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
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
		pkg.GET_ROOT_SERVER_SETTING().SECRET_KEY,
		"USER"))
	private.NewGetProfileuRouter(db, userRouter)
	private.NewGetFoldersRouter(db, userRouter)
	private.NewUploadFileRouter(db, userRouter, sftpClient)
	private.NewGetAllMetaDataFileRouter(db, userRouter, sftpClient)
	private.NewUploadVersionRouter(db, userRouter, sftpClient)
	private.NewGetVersionRouter(db, userRouter, sftpClient)
	private.NewGetInstitutionRouter(db, userRouter)
	private.NewGetChildOfInstitutiosRouter(db, userRouter)
	private.NewBringsUsersRouter(db, userRouter)
	private.NewAddNotificationRouter(db, userRouter)
	private.NewGetNotificationsRouter(db, userRouter)
	private.NewGetCurrentPhaseRouter(db, userRouter)
	private.NewDownLoadRouter(db, userRouter, sftpClient)
	private.NewDownLoadFolderRouter(db, userRouter, sftpClient)
	private.NewAddPKRouter(db, userRouter)
	private.NewUpdateFirstLastNameRouter(db, userRouter)
	private.NewUpdateNotificationRouter(db, userRouter)
	private.NewUpdatePasswordRouter(db, userRouter)
	private.NewVerifyDigitalSignatureRouter(db, userRouter)
	private.NewGetAllUsersRouter(db, userRouter)
	private.NewUpdateUserTypeRouter(db, userRouter)

	// Superuser-specific routes with middleware
	adminRouter := gin.Group("/admin")
	adminRouter.Use(middleware.JwtAuthMiddleware(
		pkg.GET_ROOT_SERVER_SETTING().SECRET_KEY,
		"ADMIN"))
	private.NewGetProfileuRouter(db, adminRouter)
	private.NewGetFoldersRouter(db, adminRouter)
	private.NewUploadFileRouter(db, adminRouter, sftpClient)
	private.NewGetAllMetaDataFileRouter(db, adminRouter, sftpClient)
	private.NewUploadVersionRouter(db, adminRouter, sftpClient)
	private.NewGetInstitutionRouter(db, adminRouter)
	private.NewGetChildOfInstitutiosRouter(db, adminRouter)
	private.NewBringsUsersRouter(db, adminRouter)
	private.NewGetVersionRouter(db, adminRouter, sftpClient)
	private.NewAddNotificationRouter(db, adminRouter)
	private.NewGetNotificationsRouter(db, adminRouter)
	private.NewGetCurrentPhaseRouter(db, adminRouter)
	private.NewDownLoadRouter(db, adminRouter, sftpClient)
	private.NewDownLoadFolderRouter(db, adminRouter, sftpClient)
	private.NewAddPKRouter(db, adminRouter)
	private.NewUpdateFirstLastNameRouter(db, adminRouter)
	private.NewUpdatePasswordRouter(db, adminRouter)
	private.NewVerifyDigitalSignatureRouter(db, adminRouter)
	private.NewUpdateNotificationRouter(db, adminRouter)
	private.NewUploadingFilesVersionPKIRouter(db, adminRouter)
	private.NewGetAllUsersRouter(db, adminRouter)
	private.NewUpdateUserTypeRouter(db, adminRouter)

	// private.NewUpdateNotificationRouter(db, adminRouter)

}
