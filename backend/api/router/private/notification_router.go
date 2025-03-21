package private

import (
	"scps-backend/api/controller"
	notificationsRepo "scps-backend/feature/home/notifications/domain/repository"
	notificationsUsecase "scps-backend/feature/home/notifications/usecase"
	"scps-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func NewAddNotificationRouter(db database.Database, group *gin.RouterGroup) {
	ir := notificationsRepo.NewVersionRepository(db)
	uc := notificationsUsecase.NewVersionUsecase(ir, "")
	ic := &controller.NotificationController{
		NotificationUsecase: uc,
	}
	group.POST("add-notification", ic.AddNotificationRequestt)
}
