package usecase

import (
	"context"
	"scps-backend/feature/home/profile/domain/entities"
	profileRepo "scps-backend/feature/home/profile/domain/repository"
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
	GetMetaDataFile(c context.Context) *ProfileResult
	GetFolders(c context.Context) *ProfileResult
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
	profileResult, err := p.repo.UploadFile(c, file_uploaded)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// GetMetaDataFile implements ProfileUsecase.
func (p *profileUsecase) GetMetaDataFile(c context.Context) *ProfileResult {
	profileResult, err := p.repo.GetMetadataFile(c)
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

// GetFolders implements ProfileUsecase.
func (p *profileUsecase) GetFolders(c context.Context) *ProfileResult {
	profileResult, err := p.repo.GetFolders(c)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}
