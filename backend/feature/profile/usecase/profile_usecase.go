package usecase

import (
	"context"
	"scps-backend/feature"
	"scps-backend/feature/profile/domain/entities"
	profileE "scps-backend/feature/profile/domain/entities"
	profileRepo "scps-backend/feature/profile/domain/repository"
)

type ProfileParams struct {
	Data any
}

type ProfileResult struct {
	Data any
	Err  error
}

type ProfileUsecase interface {
	UploadFile(c context.Context, data *ProfileParams) *ProfileResult
	GetProfile(c context.Context, data *ProfileParams) *ProfileResult
	UpdateDemand(c context.Context, data *ProfileParams) *ProfileResult
	GetInformationCard(c context.Context, data *ProfileParams) *ProfileResult
	ReciveDemand(c context.Context, user *ProfileParams) *ProfileResult
	GetAllDemands(c context.Context) *ProfileResult
}

type profileUsecase struct {
	repo       profileRepo.ProfileRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewProfileUsecase(repo profileRepo.ProfileRepository, collection string) ProfileUsecase {
	return &profileUsecase{
		repo:       repo,
		collection: collection,
	}
}

// UploadFile implements ProfileUsecase.
func (p *profileUsecase) UploadFile(c context.Context, data *ProfileParams) *ProfileResult {
	file_uploaded := data.Data.(entities.UploadFile)
	profileResult, err := p.repo.UploadFile(c, file_uploaded.FileName, file_uploaded.CodeBase64, file_uploaded.UserId)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// GetAllDemands implements ProfileUsecase.
func (p *profileUsecase) GetAllDemands(c context.Context) *ProfileResult {
	profileResult, err := p.repo.GetAllDemand(c)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// ReciveDemand implements ProfileUsecase.
func (p *profileUsecase) ReciveDemand(c context.Context, data *ProfileParams) *ProfileResult {
	user := data.Data.(*feature.User)
	user.Request = true
	user.Status = "pending"
	profileResult, err := p.repo.ReciveDemand(c, user)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

func (p *profileUsecase) UpdateDemand(c context.Context, data *ProfileParams) *ProfileResult {
	d := data.Data.(profileE.UpdateProfile)
	userData := &feature.User{}
	userData.Status = d.Status
	userData.Request = d.Request
	profileResult, err := p.repo.UpdateDemand(c, userData)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// Login implements UserUsecase.
func (p *profileUsecase) GetProfile(c context.Context, data *ProfileParams) *ProfileResult {
	profileResult, err := p.repo.GetProfile(c, data.Data.(string))
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

func (p *profileUsecase) GetInformationCard(c context.Context, data *ProfileParams) *ProfileResult {
	profileResult, err := p.repo.GetInformationCard(c, data.Data.(string))
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// CreateProfile implements ProfileUsecase.
