package usecase

import (
	"context"
	"scps-backend/feature/home/notifications/domain/entities"
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
}

type notificationUsecase struct {
	repo       notificationRepo.NotificationRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewVersionUsecase(repo notificationRepo.NotificationRepository, collection string) NotificationUsecase {
	return &notificationUsecase{
		repo:       repo,
		collection: collection,
	}
}

// AddNotification implements ProfileUsecase.
func (p *notificationUsecase) AddNotification(c context.Context, data *NotificationParams) *NotificationResult {
	notification := data.Data.(entities.Notification)
	profileResult, err := p.repo.AddNotification(c, notification)
	if err != nil {
		return &NotificationResult{Err: err}
	}
	return &NotificationResult{Data: profileResult}
}
