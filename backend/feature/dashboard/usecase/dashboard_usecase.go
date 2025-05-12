package usecase

import (
	"context"
	"scps-backend/feature/dashboard/domain/repository"
)

type DashBoardResult struct {
	Data any
	Err  error
}

type DashboardUsecase interface {
	UploadingFilesVersionPKI(ctx context.Context) *DashBoardResult
	WorkersErrorRatePKI(ctx context.Context) *DashBoardResult
	HackingTryPKI(ctx context.Context) *DashBoardResult
}

type dashboardUsecase struct {
	repo repository.DashBoardRepository
}

func NewDashboardUsecase(repo *repository.DashBoardRepository) DashboardUsecase {
	return &dashboardUsecase{repo: *repo}
}

// ⬇️ Fetches uploading files and version stats (per day/month/institution)
func (u *dashboardUsecase) UploadingFilesVersionPKI(ctx context.Context) *DashBoardResult {
	data, err := u.repo.GetUploadingFilesVersionStats(ctx)
	if err != nil {
		return &DashBoardResult{Err: err}
	}

	// Optional: Transform to DTO if needed
	return &DashBoardResult{Data: data}
}

// ⬇️ Calculates the error rate per user (invalid files / total files)
func (u *dashboardUsecase) WorkersErrorRatePKI(ctx context.Context) *DashBoardResult {
	data, err := u.repo.GetWorkersErrorRate(ctx)
	if err != nil {
		return &DashBoardResult{Err: err}
	}

	// Optional: Filter or sort
	return &DashBoardResult{Data: data}
}

// ⬇️ Groups all hacking attempt records by phase
func (u *dashboardUsecase) HackingTryPKI(ctx context.Context) *DashBoardResult {
	data, err := u.repo.GetHackingAttemptStats(ctx)
	if err != nil {
		return &DashBoardResult{Err: err}
	}

	return &DashBoardResult{Data: data}
}
