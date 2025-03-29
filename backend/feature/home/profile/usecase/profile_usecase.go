package usecase

import (
	"context"
	"scps-backend/fabric"
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
	GetProfile(c context.Context, data *ProfileParams) *ProfileResult
	GetFolders(c context.Context, folder *fabric.FolderMetadata) *ProfileResult
	GetCurrentPhase(c context.Context) *ProfileResult
	AddPK(c context.Context, userId string, pk string) *ProfileResult
	UpdateFirstLastName(c context.Context, userId string, firstName string, lastName string) *ProfileResult
	UpdatePassword(c context.Context, userId string, oldPassword string, newPassword string) *ProfileResult
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

// Login implements UserUsecase.
func (p *profileUsecase) GetProfile(c context.Context, data *ProfileParams) *ProfileResult {
	profileResult, err := p.repo.GetProfile(c, data.Data.(string))
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// GetFolders implements ProfileUsecase.
func (p *profileUsecase) GetFolders(c context.Context, folder *fabric.FolderMetadata) *ProfileResult {
	profileResult, err := p.repo.GetFolders(c, folder)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

func (p *profileUsecase) GetCurrentPhase(c context.Context) *ProfileResult {
	phase, err := p.repo.GetCurrentPhase(c)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: phase}
}

func (p *profileUsecase) AddPK(c context.Context, userId string, pk string) *ProfileResult {
	err := p.repo.AddPK(userId, pk)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: true}
}

func (p *profileUsecase) UpdateFirstLastName(c context.Context, userId string, firstName string, lastName string) *ProfileResult {
	err := p.repo.UpdateFirstLastName(userId, firstName, lastName)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: true}
}

func (p *profileUsecase) UpdatePassword(c context.Context, userId string, oldPassword string, newPassword string) *ProfileResult {
	err := p.repo.UpdatePassword(userId, oldPassword, newPassword)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: true}
}
