package usecase

import (
	"context"
	"scps-backend/feature/home/profile/domain/entities"
	versionRepo "scps-backend/feature/home/version/domain/repository"
)

type VersionParams struct {
	Data any
}

type VersionResult struct {
	Data any
	Err  error
}

type VersionUsecase interface {
	UploadVersion(c context.Context, data *VersionParams) *VersionResult
	GetMetaDataVersion(c context.Context) *VersionResult
}

type versionUsecase struct {
	repo       versionRepo.VersionRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewVersionUsecase(repo versionRepo.VersionRepository, collection string) VersionUsecase {
	return &versionUsecase{
		repo:       repo,
		collection: collection,
	}
}

// UploadVersion implements ProfileUsecase.
func (p *versionUsecase) UploadVersion(c context.Context, data *VersionParams) *VersionResult {
	file_uploaded := data.Data.(entities.UploadFile)
	profileResult, err := p.repo.UploadVersion(c, file_uploaded)
	if err != nil {
		return &VersionResult{Err: err}
	}
	return &VersionResult{Data: profileResult}
}

// GetMetaDataVersion implements ProfileUsecase.
func (p *versionUsecase) GetMetaDataVersion(c context.Context) *VersionResult {
	profileResult, err := p.repo.GetMetadataVersion(c)
	if err != nil {
		return &VersionResult{Err: err}
	}
	return &VersionResult{Data: profileResult}
}
