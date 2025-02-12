package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/fabric"
	"scps-backend/feature/profile/domain/entities"
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
	SaveMetaDataVersion(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error)
	UploadVersion(c context.Context, file entities.UploadFile) (*[]fabric.FileMetadata, error)
	GetMetadataVersion(c context.Context) (*[]fabric.FileMetadata, error)
}

func NewVersionRepository(db database.Database) VersionRepository {
	return &versionRepository{
		database: db,
	}
}

func (s *versionRepository) UploadVersion(c context.Context, file entities.UploadFile) (*[]fabric.FileMetadata, error) {
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
		Organisation: file.Organisation,
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

func (s *versionRepository) SaveMetaDataVersion(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error) {
	// collection := s.database.Collection("metadata-file")
	// resulat, err := collection.InsertOne(c, &metadata)
	// if err != nil {
	// 	log.Printf("Failed to create metadata-file: %v", err)
	// 	return nil, err
	// }
	return nil, nil
}

func (s *versionRepository) GetMetadataVersion(c context.Context) (*[]fabric.FileMetadata, error) {
	//fabric.SdkProvider("deleteAll")
	result, err := fabric.SdkProvider("getAll")
	if err != nil {
		return nil, err
	}
	files, ok := result.(*[]fabric.FileMetadata)
	if !ok {
		return nil, fmt.Errorf("failed to convert result to []fabric.FileMetadata")
	}
	location := "../../ftp/"
	for i := range *files {
		file := &(*files)[i]
		filePath := location + file.FileName
		if !util.FileExists(filePath) {
			log.Printf("File not found: %s", filePath)
			file.Status = "Deleted"
			continue
		}
		checksum, err := util.CalculateChecksum(filePath)
		if err != nil {
			log.Printf("Error calculating checksum for %s: %v\n", file.FileName, err)
			file.Status = "ChecksumError"
			continue
		}
		fmt.Printf("(Recalculation)  Checksum: %s\n", checksum)
		fmt.Printf("(Blockchain) Checksum: %s\n", file.HashFile)
		if file.HashFile == checksum {
			file.Status = "Valid"
		} else {
			file.Status = "Invalid"
		}
		log.Println(*file)
		(*files)[i] = *file

	}
	return files, nil
}
