package repository

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"scps-backend/fabric"
	"scps-backend/feature"
	notificationsRepo "scps-backend/feature/home/notifications/domain/repository"
	"strings"

	"scps-backend/feature/home/version/domain/entities"

	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/pkg/sftp"
	"go.mongodb.org/mongo-driver/bson"
)

type versionRepository struct {
	database   database.Database
	sftpClient *sftp.Client
}

// GetAllDemand implements VersionRepository.
type VersionRepository interface {
	UploadVersion(c context.Context, file entities.UploadVersion) (*fabric.FileMetadata, error)
	GetMetadataVersionByParentFile(c context.Context, folder string, parent string) (*[]fabric.FileMetadata, error)
}

func NewVersionRepository(db database.Database, sftpClient *sftp.Client) VersionRepository {
	return &versionRepository{
		database:   db,
		sftpClient: sftpClient,
	}
}

func (s *versionRepository) UploadVersion(c context.Context, file entities.UploadVersion) (*fabric.FileMetadata, error) {
	fileID := uuid.New()
	// teste if sdtp instance found
	if s.sftpClient == nil {
		return nil, fmt.Errorf("sftp client is not initialized")
	}

	parts := strings.Split(file.CodeBase64, ",")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid base64 format")
	}

	decodedContent, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("error decoding base64: %v", err)
	}
	checksum, err := util.CalculateChecksumFromBytes(decodedContent)

	if err != nil {
		return nil, fmt.Errorf("error calculating checksum: %v", err)
	}

	fmt.Printf("SHA-256 File Checksum: %s\n", checksum)
	fmt.Printf("USER ID: %s\n", file.UserId)

	slisces := strings.Split(file.Parent, ".")
	if len(parts) != 2 {
		return nil, fmt.Errorf("error in split extension of version parent")
	}

	remoteFolderPath := "/cnr/uploads/" + file.Folder + "/Versions_Of_" + slisces[0] + "/"
	remoteVersionPath := remoteFolderPath + file.Name

	fmt.Printf("SHA-256 Version Checksum: %s\n", checksum)
	fmt.Printf("USER ID: %s\n", file.UserId)

	fileMetaData := &fabric.FileMetadata{
		ID:           fileID.String(),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		LastVersion:  strconv.Itoa(file.Version),
		Commit:       file.Commit,
		Time:         time.Now().Format(time.RFC3339),
		Action:       file.Action,
		Folder:       remoteFolderPath,
		Description:  file.Description,
		Organisation: file.Organisation,
		Path:         remoteVersionPath,
		Destination:  file.Destination,
		ReciverId:    file.ReciverId,
		TaggedUsers:  file.TaggedUser,
	}

	log.Println(fileMetaData)

	fileIDMongo, err := s.addFileToDB(c, *fileMetaData)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted file metadata into MongoDB:", fileIDMongo)

	err = AccessBase64ToSFTP(parts[1], remoteVersionPath, s.sftpClient)
	if err != nil {
		log.Panic("error sftp : %v", err)
		return nil, fmt.Errorf("error sftp : %v", err)
	}

	_, err = fabric.SdkProvider("add-version", fileMetaData, file.HashParent)
	if err != nil {
		fmt.Println("Error adding version to Fabric Ledger:", err)
		return nil, err
	}

	// Send notifications to tagged users and receiver
	notificationMessage := fmt.Sprintf("Nouvelle version du fichier '%s' a été ajoutée", file.Name)

	nr := notificationsRepo.NewNotificationRepository(s.database)

	if err != nil {
		log.Printf("Error getting receiver profile: %v", err)
	}
	// Send notification to receiver
	if file.ReciverId != "" {
		receiverNotification := &feature.Notification{
			Receivers: []string{file.ReciverId},
			Title:     "Nouvelle version ajoutée",
			Message:   notificationMessage,
			Time:      time.Now(),
			SenderId:  file.UserId,
			Path:      filepath.Join("/home/peer", file.UserId, file.Folder, file.Parent),
		}
		_, err = nr.AddNotification(c, *receiverNotification)
		if err != nil {
			log.Printf("Error sending notification to receiver: %v", err)
		}
	}
	// Send notifications to tagged users
	if len(file.TaggedUser) > 0 {
		taggedUserNotification := &feature.Notification{
			Receivers: file.TaggedUser,
			Title:     "Nouvelle version ajoutée",
			Message:   notificationMessage,
			Time:      time.Now(),
			SenderId:  file.UserId,
			Path:      filepath.Join("/home", file.Folder, file.Parent),
		}
		_, err = nr.AddNotification(c, *taggedUserNotification)
		if err != nil {
			log.Printf("Error sending notification to receiver: %v", err)
		}
	}
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

func (s *versionRepository) GetMetadataVersionByParentFile(c context.Context, folder string, parent string) (*[]fabric.FileMetadata, error) {
	if s.sftpClient == nil {
		return nil, fmt.Errorf("sftp client is not initialized")
	}
	result, err := fabric.SdkProvider("get-version", parent)
	if err != nil {
		return nil, err
	}
	files, ok := result.(*[]fabric.FileMetadata)
	if !ok {
		return nil, fmt.Errorf("failed to convert result to []fabric.FileMetadata")
	}
	// location := "../../ftp/" + folder + "/"

	for i := range *files {
		file := &(*files)[i]
		filePath := file.Path
		remoteFile, err := s.sftpClient.Open(filePath)
		if err != nil {
			log.Printf("File not found on SFTP: %s\n", remoteFile)
			file.Status = "Deleted"
			continue
		}
		fileContent, err := io.ReadAll(remoteFile)
		remoteFile.Close()
		if err != nil {
			log.Printf("Error reading file from SFTP: %s, %v\n", remoteFile, err)
			file.Status = "ReadError"
			continue
		}
		checksum, err := util.CalculateChecksumFromBytes(fileContent)
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
		(*files)[i] = *file
		(*files)[i] = *file

	}
	return files, nil
}
