package repository

import (
	"context"
	"fmt"
	"scps-backend/feature/home/notifications/domain/entities"
	"scps-backend/pkg/database"
)

type notificationRepository struct {
	database database.Database
}

type NotificationRepository interface {
	AddNotification(c context.Context, notifications entities.Notification) (*entities.Notification, error)
}

func NewVersionRepository(db database.Database) NotificationRepository {
	return &notificationRepository{
		database: db,
	}
}

func (s *notificationRepository) AddNotification(c context.Context, notifications entities.Notification) (*entities.Notification, error) {
	collection := s.database.Collection(database.NOTIFICATION.String())
	notifications.ID = ""
	result, err := collection.InsertOne(c, notifications)
	if err != nil {
		fmt.Println("Error inserting file notifications into MongoDB:", err)
		return nil, err
	}
	fmt.Printf("Notification inserted with ID: %v\n", result.(string))
	notifications.ID = result.(string)
	return &notifications, nil
}
