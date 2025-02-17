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
	// GetInstitutions(c context.Context) *ProfileResult
	GetPeers(c context.Context, nameInstitutions string, idInstitutions string) *ProfileResult
}

type institutionsUsecase struct {
	repo       institutionsRepo.InstitutionsRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewInstitutionsUsecase(repo institutionsRepo.InstitutionsRepository, collection string) InstituationsUsecase {
	return &institutionsUsecase{
		repo:       repo,
		collection: collection,
	}
}

// GetPeers implements InstituationsUsecase.
func (p *institutionsUsecase) GetPeers(c context.Context, nameInstitutions string, idInstitutions string) *ProfileResult {
	profileResult, err := p.repo.GetPeers(c, nameInstitutions, idInstitutions)
	if err != nil {
		return &ProfileResult{Err: err}
	}
	return &ProfileResult{Data: profileResult}
}

// func (p *institutionsUsecase) GetInstitutions(c context.Context) *ProfileResult {
// 	profileResult, err := p.repo.GetInstitutions(c)
// 	if err != nil {
// 		return &ProfileResult{Err: err}
// 	}
// 	return &ProfileResult{Data: profileResult}
// }
