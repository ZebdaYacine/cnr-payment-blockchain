package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/feature"
	profileRepo "scps-backend/feature/home/profile/domain/repository"
	"scps-backend/pkg/database"
	"scps-backend/util/email"
	"strings"

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

	// Get sender profile
	sender, err := pr.GetProfile(c, notifications.SenderId)
	if err != nil {
		log.Printf("Error getting sender profile: %v", err)
		return nil, err
	}
	notifications.Sender = *sender

	// Collect all user emails (receivers + tagged users)
	var userEmails []string

	// Get receivers' emails
	for _, receiverId := range notifications.Receivers {
		receiver, err := pr.GetProfile(c, receiverId)
		if err != nil {
			log.Printf("Warning: Could not get receiver profile for ID %s: %v", receiverId, err)
			continue
		}
		if receiver.Email != "" {
			userEmails = append(userEmails, receiver.Email)
		}
	}

	// Send email to each user
	var linkHTML string
	if notifications.Path != "" {
		linkPath := notifications.Path + "/"
		if !strings.HasPrefix(linkPath, "/home") {
			linkPath = "/home/" + linkPath
		}
		linkHTML = fmt.Sprintf(`<p><a href="https://cnr:5173/%s">Cliquez ici pour voir plus de détails</a></p>`, linkPath)
	}

	emailBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body {
					font-family: 'Arial', sans-serif;
					line-height: 1.6;
					color: #333333;
					max-width: 600px;
					margin: 0 auto;
					padding: 20px;
				}
				.container {
					background-color: #ffffff;
					border-radius: 8px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					padding: 25px;
					border: 1px solid #e0e0e0;
				}
				.header {
					background-color: #1a73e8;
					color: white;
					padding: 15px 20px;
					border-radius: 6px;
					margin-bottom: 20px;
				}
				.title {
					margin: 0;
					font-size: 24px;
					font-weight: 600;
				}
				.message {
					background-color: #f8f9fa;
					padding: 15px;
					border-radius: 6px;
					margin-bottom: 20px;
				}
				.message p {
					font-style: italic;
					font-weight: bold;
					font-size: 16px;
					margin: 0;
					color: #333333;
				}
				.link-button {
					display: inline-block;
					background-color: #1a73e8;
					color: #ffffff;
					padding: 12px 24px;
					text-decoration: none;
					border-radius: 4px;
					margin: 15px 0;
					transition: background-color 0.3s ease;
					font-weight: 500;
				}
				.link-button:hover {
					background-color: #1557b0;
					color: #ffffff;
				}
				.sender-info {
					margin-top: 25px;
					padding-top: 15px;
					border-top: 1px solid #e0e0e0;
				}
				.sender-detail {
					color: #666666;
					margin: 5px 0;
					font-size: 14px;
				}
				.label {
					font-weight: 600;
					color: #444444;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1 class="title">%s</h1>
				</div>
				<div class="message">
					<p>%s</p>
				</div>
				%s
				<div class="sender-info">
					<p class="sender-detail"><span class="label">Envoyé par:</span> %s</p>
					<p class="sender-detail"><span class="label">De:</span> %s / %s</p>
				</div>
			</div>
		</body>
		</html>
	`,
		notifications.Title,
		notifications.Message,
		strings.Replace(linkHTML, "<a ", `<a class="link-button" `, 1),
		notifications.Sender.UserName,
		notifications.Sender.WorkAt,
		notifications.Sender.Wilaya,
	)

	for _, userEmail := range userEmails {
		err := email.SendEmail(
			userEmail,
			notifications.Title,
			emailBody,
		)
		if err != nil {
			log.Printf("Warning: Failed to send email to %s: %v", userEmail, err)
			// Continue with other emails even if one fails
			continue
		}
	}

	// Store notification in database
	collection := s.database.Collection(database.NOTIFICATION.String())
	notifications.ID = ""

	result, err := collection.InsertOne(c, notifications)
	if err != nil {
		fmt.Println("Error inserting notifications into MongoDB:", err)
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
