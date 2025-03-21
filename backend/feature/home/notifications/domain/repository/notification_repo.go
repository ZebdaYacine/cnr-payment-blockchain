package repository

import (
	"context"
	"fmt"
	"scps-backend/feature/home/notifications/domain/entities"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
)

type notificationRepository struct {
	database database.Database
}

type NotificationRepository interface {
	GetNotifications(c context.Context, receiverId string) ([]*entities.Notification, error)
	AddNotification(c context.Context, notifications entities.Notification) (*entities.Notification, error)
}

func NewNotificationRepository(db database.Database) NotificationRepository {
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

func (s *notificationRepository) GetNotifications(c context.Context, receiverId string) ([]*entities.Notification, error) {
	filter := bson.M{"receiverId": receiverId}
	collection := s.database.Collection(database.NOTIFICATION.String())
	cursor, err := collection.Find(c, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(c)
	var notifications []*entities.Notification
	for cursor.Next(c) {
		var notif entities.Notification
		if err := cursor.Decode(&notif); err != nil {
			return nil, err
		}
		notifications = append(notifications, &notif)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return notifications, nil
}
