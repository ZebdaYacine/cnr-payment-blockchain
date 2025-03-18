package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/fabric"
	"scps-backend/feature/home/version/domain/entities"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"
)

type versionRepository struct {
	database database.Database
}

// GetAllDemand implements VersionRepository.
type VersionRepository interface {
	UploadVersion(c context.Context, file entities.UploadVersion) (*[]fabric.FileMetadata, error)
}

func NewVersionRepository(db database.Database) VersionRepository {
	return &versionRepository{
		database: db,
	}
}

func (s *versionRepository) UploadVersion(c context.Context, file entities.UploadVersion) (*[]fabric.FileMetadata, error) {
	output := "../../ftp/" + file.Name
	err := util.Base64ToFile(file.CodeBase64, output)
	if err != nil {
		return nil, err
	}
	checksum, err := util.CalculateChecksum(output)
	if err != nil {
		fmt.Printf("Error calculating checksum: %v\n", err)
	}
	fmt.Printf("SHA-256 File Checksum: %s\n", checksum)
	fmt.Printf("USER ID: %s\n", file.UserId)

	id := time.Now().UnixMilli()
	metadata := &fabric.FileMetadata{
		ID:           strconv.FormatInt(id, 10),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		Time:         time.Now().Format(time.RFC3339),
		Action:       file.Action,
		Organisation: "file.Organisation",
	}
	log.Println(metadata.Action)
	log.Println(metadata.Organisation)
	log.Println(metadata.Parent)
	log.Println(metadata.Version)

	// fabric.SdkProvider("deleteAll", metadata)
	result, err := fabric.SdkProvider("add", metadata)
	if err != nil {
		return nil, err
	}
	files, ok := result.(*[]fabric.FileMetadata)
	if !ok {
		return nil, fmt.Errorf("failed to convert result to []fabric.FileMetadata")
	}
	for i := range *files {
		file := &(*files)[i]
		file.Status = "Valid"
		(*files)[i] = *file
	}
	return files, err
}
