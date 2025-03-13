package usecase

import (
	"context"
	"scps-backend/feature/home/file/domain/entities"
	fileRepo "scps-backend/feature/home/file/domain/repository"
)

type FileParams struct {
	Data any
}

type FileResult struct {
	Data any
	Err  error
}

type FileUsecase interface {
	UploadFile(c context.Context, data *FileParams) *FileResult
	GetMetaDataFile(c context.Context, foldername string) *FileResult
	GetMetaDataFileByFolderName(c context.Context, foldername string) *FileResult
}

type fileUsecase struct {
	repo       fileRepo.FileRepository
	collection string
}

// SearchIfEamilExiste implements ProfileUsecase.
func NewFileUsecase(repo fileRepo.FileRepository, collection string) FileUsecase {
	return &fileUsecase{
		repo:       repo,
		collection: collection,
	}
}

// UploadFile implements ProfileUsecase.
func (p *fileUsecase) UploadFile(c context.Context, data *FileParams) *FileResult {
	file_uploaded := data.Data.(entities.UploadFile)
	profileResult, err := p.repo.UploadFile(c, file_uploaded)
	if err != nil {
		return &FileResult{Err: err}
	}
	return &FileResult{Data: profileResult}
}

// GetMetaDataFile implements ProfileUsecase.
func (p *fileUsecase) GetMetaDataFile(c context.Context, foldername string) *FileResult {
	profileResult, err := p.repo.GetMetadataFile(c, foldername)
	if err != nil {
		return &FileResult{Err: err}
	}
	return &FileResult{Data: profileResult}
}

func (p *fileUsecase) GetMetaDataFileByFolderName(c context.Context, foldername string) *FileResult {
	profileResult, err := p.repo.GetMetadataFileByFolderName(c, foldername)
	if err != nil {
		return &FileResult{Err: err}
	}
	return &FileResult{Data: profileResult}
}
