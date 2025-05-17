package usecase

import (
	"context"
	institutionsRepo "scps-backend/feature/home/institutions/domain/repository"
)

type ProfileParams struct {
	Data any
}

type ProfileResult struct {
	Data any
	Err  error
}

type InstituationsUsecase interface {
	BringUsers(c context.Context, userid string) *ProfileResult
	GetPeers(c context.Context, nameInstitutions string, idInstitutions string, userid string) *ProfileResult
}

type institutionsUsecase struct {
	repo       institutionsRepo.InstitutionsRepository
	collection string
}

func NewInstitutionsUsecase(repo institutionsRepo.InstitutionsRepository, collection string) InstituationsUsecase {
	return &institutionsUsecase{
		repo:       repo,
		collection: collection,
	}
}

// GetPeers implements InstituationsUsecase.
func (p *institutionsUsecase) GetPeers(c context.Context, nameInstitutions string, idInstitutions string, userid string) *ProfileResult {
	profileResult, err := p.repo.GetPeers(c, nameInstitutions, idInstitutions, userid)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

func (p *institutionsUsecase) BringUsers(c context.Context, userid string) *ProfileResult {
	profileResult, err := p.repo.BringUsers(c, userid)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}
