package private

import (
	"scps-backend/api/controller"
	notificationsRepo "scps-backend/feature/home/notifications/domain/repository"
	notificationsUsecase "scps-backend/feature/home/notifications/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewAddNotificationRouter(db database.Database, group *gin.RouterGroup) {
	ir := notificationsRepo.NewNotificationRepository(db)
	uc := notificationsUsecase.NewNOtificationUsecase(ir, "")
	ic := &controller.NotificationController{
		NotificationUsecase: uc,
	}
	group.POST("add-notification", ic.AddNotificationRequestt)
}

func NewGetNotificationsRouter(db database.Database, group *gin.RouterGroup) {
	ir := notificationsRepo.NewNotificationRepository(db)
	uc := notificationsUsecase.NewNOtificationUsecase(ir, "")
	ic := &controller.NotificationController{
		NotificationUsecase: uc,
	}
	group.GET("get-notifications", ic.GetNotificationsRequestt)
}

func NewUpdateNotificationRouter(db database.Database, group *gin.RouterGroup) {
	ir := notificationsRepo.NewNotificationRepository(db)
	uc := notificationsUsecase.NewNOtificationUsecase(ir, "")
	ic := &controller.NotificationController{
		NotificationUsecase: uc,
	}
	group.POST("update-notification", ic.UpdateNotificationRequestt)
}
