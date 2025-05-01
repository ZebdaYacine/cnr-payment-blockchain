package usecase

import (
	"context"
	"scps-backend/feature"
	notificationRepo "scps-backend/feature/home/notifications/domain/repository"
)

type NotificationParams struct {
	Data any
}

type NotificationResult struct {
	Data any
	Err  error
}

type NotificationUsecase interface {
	AddNotification(c context.Context, data *NotificationParams) *NotificationResult
	GetNotifications(c context.Context, receiverId string) *NotificationResult
	UpdateNotification(c context.Context, notificationId string) *NotificationResult
}

type notificationUsecase struct {
	repo       notificationRepo.NotificationRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewNOtificationUsecase(repo notificationRepo.NotificationRepository, collection string) NotificationUsecase {
	return &notificationUsecase{
		repo:       repo,
		collection: collection,
	}
}

func (p *notificationUsecase) AddNotification(c context.Context, data *NotificationParams) *NotificationResult {
	notification := data.Data.(feature.Notification)
	notificationResult, err := p.repo.AddNotification(c, notification)
	if err != nil {
		return &NotificationResult{Err: err}
	}
	return &NotificationResult{Data: notificationResult}
}

func (p *notificationUsecase) GetNotifications(c context.Context, receiverId string) *NotificationResult {
	notificationResult, err := p.repo.GetNotifications(c, receiverId)
	if err != nil {
		return &NotificationResult{Err: err}
	}
	return &NotificationResult{Data: notificationResult}
}

func (p *notificationUsecase) UpdateNotification(c context.Context, notificationId string) *NotificationResult {
	notificationResult, err := p.repo.UpdateNotification(c, notificationId)
	if err != nil {
		return &NotificationResult{Err: err}
	}
	return &NotificationResult{Data: notificationResult}
}
