package controller

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/core"
	"scps-backend/feature"
	"scps-backend/pkg"
	util "scps-backend/util/token"

	"scps-backend/feature/home/notifications/usecase"

	"github.com/gin-gonic/gin"
)

type NotificationController struct {
	NotificationUsecase usecase.NotificationUsecase
}

func (ic *NotificationController) AddNotificationRequestt(c *gin.Context) {
	log.Println("************************ ADD NOTIFICATION REQUEST ************************")
	var notification feature.Notification
	if !core.IsDataRequestSupported(&notification, c) {
		return
	}
	token := util.GetToken(c)
	userid, err := util.ExtractIDFromToken(token, pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY)
	if err != nil {
		c.JSON(http.StatusNonAuthoritativeInfo, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	notification.SenderId = userid
	log.Println("notification  :", notification)
	notification.IsRead = false
	notificationParams := &usecase.NotificationParams{}
	notificationParams.Data = notification
	resulat := ic.NotificationUsecase.AddNotification(c, notificationParams)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "ADD NOTIFICATION SUCCESSFULY",
		Data:    resulat.Data,
	})
}

func (ic *NotificationController) GetNotificationsRequestt(c *gin.Context) {
	log.Println("************************ GET NOTIFICATIONS REQUEST ************************")
	token := util.GetToken(c)
	userid, err := util.ExtractIDFromToken(token, pkg.GET_ROOT_SERVER_SEETING().SECRET_KEY)
	if err != nil {
		c.JSON(http.StatusNonAuthoritativeInfo, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	resulat := ic.NotificationUsecase.GetNotifications(c, userid)
	if err := resulat.Err; err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Message: err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, model.SuccessResponse{
		Message: "GET NOTIFICATIONS REQUEST",
		Data:    resulat.Data,
	})
}
