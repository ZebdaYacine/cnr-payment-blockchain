package private

import (
	"scps-backend/api/controller"
	filerepo "scps-backend/feature/home/file/domain/repository"
	fileusecase "scps-backend/feature/home/file/usecase"
	profilerepo "scps-backend/feature/home/profile/domain/repository"
	profileusecase "scps-backend/feature/home/profile/usecase"

	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/pkg/sftp"
)

func NewGetProfileuRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-profile", ic.GetProfileRequest)
}

func NewUploadFileRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := filerepo.NewFileRepository(db, sftpClient)
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

func NewGetAllMetaDataFileRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := filerepo.NewFileRepository(db, sftpClient)
	uc := fileusecase.NewFileUsecase(ir, "")
	ic := &controller.FileController{
		FileUsecase: uc,
	}
	group.GET("get-all-files-metadata", ic.GetAllFilesMetaDataByFolderNameRequest)
}

func NewGetCurrentPhaseRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-current-phase", ic.GetCurrentPhaseRequest)
}

func NewDownLoadRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := filerepo.NewFileRepository(db, sftpClient)
	uc := fileusecase.NewFileUsecase(ir, "")
	ic := &controller.FileController{
		FileUsecase: uc,
		SftpClient:  sftpClient,
	}
	group.POST("download-files", ic.DownloadFilesRequest)
}

func NewDownLoadFolderRouter(db database.Database, group *gin.RouterGroup, sftpClient *sftp.Client) {
	ir := filerepo.NewFileRepository(db, sftpClient)
	uc := fileusecase.NewFileUsecase(ir, "")
	ic := &controller.FileController{
		FileUsecase: uc,
		SftpClient:  sftpClient,
	}
	group.POST("download-folder", ic.DownloadFilesOfFolderRequest)
}

func NewAddPKRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("add-pk", ic.AddPKRequest)
}

func NewUpdateFirstLastNameRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("update-name", ic.UpdateFirstLastNameRequest)
}

func NewUpdatePasswordRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("update-password", ic.UpdatePasswordRequest)
}

func NewVerifyDigitalSignatureRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("verify-signature", ic.VerifyDigitalSignature)
}

func NewGetAllUsersRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.GET("get-all-users", ic.GetAllUsersRequest)
}

func NewUpdateUserTypeRouter(db database.Database, group *gin.RouterGroup) {
	ir := profilerepo.NewProfileRepository(db)
	uc := profileusecase.NewProfileUsecase(ir, "")
	ic := &controller.ProfileController{
		ProfileUsecase: uc,
	}
	group.POST("update-user-type", ic.UpdateUserTypeRequest)
}
