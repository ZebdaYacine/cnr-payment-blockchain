package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/feature"
	profileRepo "scps-backend/feature/home/profile/domain/repository"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
)

type notificationRepository struct {
	database database.Database
}

type NotificationRepository interface {
	GetNotifications(c context.Context, receiverId string) ([]*feature.Notification, error)
	AddNotification(c context.Context, notifications feature.Notification) (*feature.Notification, error)
}

func NewNotificationRepository(db database.Database) NotificationRepository {
	return &notificationRepository{
		database: db,
	}
}

func (s *notificationRepository) AddNotification(c context.Context, notifications feature.Notification) (*feature.Notification, error) {
	pr := profileRepo.NewProfileRepository(s.database)
	sender, err := pr.GetProfile(c, notifications.SenderId)
	if err != nil {
		log.Panic("Error getting receiver profile: %v", err)
	}
	collection := s.database.Collection(database.NOTIFICATION.String())
	notifications.ID = ""
	notifications.Sender = *sender
	log.Println(">>>>>>>>>>>>>>>>>", *sender)
	log.Println(">>>>>>>>>>>>>>>>>", notifications)

	result, err := collection.InsertOne(c, notifications)
	if err != nil {
		fmt.Println("Error inserting file notifications into MongoDB:", err)
		return nil, err
	}
	fmt.Printf("Notification inserted with ID: %v\n", result.(string))
	notifications.ID = result.(string)
	return &notifications, nil
}

func (s *notificationRepository) GetNotifications(c context.Context, receiverId string) ([]*feature.Notification, error) {
	filter := bson.M{"receiverId": receiverId}
	collection := s.database.Collection(database.NOTIFICATION.String())
	cursor, err := collection.Find(c, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(c)
	var notifications []*feature.Notification
	for cursor.Next(c) {
		var notif feature.Notification
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
