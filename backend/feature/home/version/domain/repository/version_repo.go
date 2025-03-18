package repository

import (
	"context"
	"errors"
	"fmt"
	"os"
	"scps-backend/fabric"
	"scps-backend/feature/home/version/domain/entities"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type versionRepository struct {
	database database.Database
}

// GetAllDemand implements VersionRepository.
type VersionRepository interface {
	UploadVersion(c context.Context, file entities.UploadVersion) (*fabric.FileMetadata, error)
}

func NewVersionRepository(db database.Database) VersionRepository {
	return &versionRepository{
		database: db,
	}
}

func (s *versionRepository) UploadVersion(c context.Context, file entities.UploadVersion) (*fabric.FileMetadata, error) {
	fileID := uuid.New()

	versionPath := "../../ftp/" + file.Folder + "/" + "Versions_Of_" + file.Parent
	err := os.MkdirAll(versionPath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating folder:", err)
		return nil, err
	}

	output := versionPath + "/" + file.Name
	err = util.Base64ToFile(file.CodeBase64, output)
	if err != nil {
		return nil, fmt.Errorf("error converting Base64 to file: %v", err)
	}

	checksum, err := util.CalculateChecksum(output)
	if err != nil {
		return nil, fmt.Errorf("error calculating checksum: %v", err)
	}

	fmt.Printf("SHA-256 Version Checksum: %s\n", checksum)
	fmt.Printf("USER ID: %s\n", file.UserId)

	fileMetaData := &fabric.FileMetadata{
		ID:           fileID.String(),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		Time:         time.Now().Format(time.RFC3339),
		Action:       file.Action,
		Folder:       versionPath,
		Description:  file.Description,
		Organisation: "DIO",
		Path:         output,
		Destination:  "",
		ReciverId:    "",
		TaggedUsers:  []string{},
	}

	_, err = fabric.SdkProvider("add-file", fileMetaData)
	if err != nil {
		fmt.Println("Error adding file to Fabric Ledger:", err)
		return nil, err
	}

	fileIDMongo, err := s.addFileToDB(c, *fileMetaData)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted file metadata into MongoDB:", fileIDMongo)

	return fileMetaData, nil
}

func (s *versionRepository) addFileToDB(c context.Context, metadata fabric.FileMetadata) (string, error) {
	collection := s.database.Collection(database.FILE.String())
	count, err := collection.CountDocuments(c, bson.M{
		"file_name": metadata.FileName,
		"folder":    metadata.Folder,
	})
	if err != nil {
		fmt.Println("Error checking file existence in MongoDB:", err)
		return "", err
	}
	if count > 0 {
		return "", errors.New("file already exists in MongoDB. Skipping insertion")
	}
	result, err := collection.InsertOne(c, metadata)
	if err != nil {
		fmt.Println("Error inserting file metadata into MongoDB:", err)
		return "", err
	}
	fmt.Printf("File inserted with ID: %v\n", result.(string))
	return result.(string), nil
}
