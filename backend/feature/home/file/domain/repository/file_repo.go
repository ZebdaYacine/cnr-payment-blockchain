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
	"scps-backend/feature/home/file/domain/entities"
	notificationsRepo "scps-backend/feature/home/notifications/domain/repository"
	versionRepo "scps-backend/feature/home/version/domain/repository"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/pkg/sftp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type fileRepository struct {
	database   database.Database
	sftpClient *sftp.Client
}

// GetAllDemand implements FileRepository.
type FileRepository interface {
	DownloadFiles(c context.Context, files []entities.Data) (map[string][]string, error)
	UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error)
	GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error)
	DownloadFilesOfFolder(c context.Context, folder string) (map[string][]string, error)
}

func NewFileRepository(db database.Database, sftpClient *sftp.Client) FileRepository {
	return &fileRepository{
		database:   db,
		sftpClient: sftpClient,
	}
}
func (s *fileRepository) UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error) {
	fileID := uuid.New()
	folderID := uuid.New()
	if s.sftpClient == nil {
		return nil, fmt.Errorf("sftp client is not initialized")
	}

	if file.Folder == "" {
		file.Folder = fmt.Sprintf("%02d-%02d", time.Now().Month(), time.Now().Day())
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

	remoteFolderPath := "/cnr/uploads/" + file.Folder
	remoteFilePath := remoteFolderPath + "/" + file.Name

	fileMetaData := &fabric.FileMetadata{
		ID:           fileID.String(),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		LastVersion:  strconv.Itoa(file.Version),
		Time:         time.Now().Format(time.RFC3339),
		Action:       file.Action,
		Folder:       file.Folder,
		Description:  file.Description,
		Organisation: file.Organisation,
		Path:         remoteFilePath,
		Destination:  file.Destination,
		ReciverId:    file.ReciverId,
		TaggedUsers:  file.TaggedUser,
		Phase:        file.Phase,
	}

	folderMetaData := &fabric.FolderMetadata{
		ID:           folderID.String(),
		Name:         file.Folder,
		Path:         remoteFolderPath,
		NbrItems:     1,
		UserId:       file.UserId,
		Destination:  file.Destination,
		Organisation: file.Organisation,
		TaggedUsers:  file.TaggedUser,
		ReciverId:    file.ReciverId,
		CreateAt:     time.Now().Format(time.RFC3339),
		Phase:        file.Phase,
	}

	log.Println(fileMetaData)

	Id, err := s.addFolderToDB(c, *folderMetaData)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted folder metadata into MongoDB:", Id)

	fileIDMongo, err := s.addFileToDB(c, *fileMetaData)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted file metadata into MongoDB:", fileIDMongo)

	err = AccessBase64ToSFTP(parts[1], remoteFilePath, s.sftpClient)
	if err != nil {
		log.Panic("error sftp : %v", err)
		return nil, fmt.Errorf("error sftp : %v", err)
	}

	_, err = fabric.SdkProvider("add-file", fileMetaData)
	if err != nil {
		fmt.Println("Error adding file to Fabric Ledger:", err)
		return nil, err
	}

	_, err = fabric.SdkProvider("add-folder", folderMetaData)
	if err != nil {
		fmt.Println("Error adding folder to Fabric Ledger:", err)
		fabric.SdkProvider("deleteAll")
		return nil, err
	}

	return fileMetaData, nil
}

func (s *fileRepository) addFileToDB(c context.Context, metadata fabric.FileMetadata) (string, error) {
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

func (s *fileRepository) addFolderToDB(c context.Context, folder fabric.FolderMetadata) (string, error) {
	collection := s.database.Collection(database.FOLDER.String())
	count, err := collection.CountDocuments(c, bson.M{
		"name": folder.Name,
	})
	if err != nil {
		fmt.Println("Error checking folder existence in MongoDB:", err)
		return "", err
	}
	if count > 0 {
		fmt.Println("folder is existe......!")
		result, err := s.updateNbrItemsInFolder(c, folder.Name)
		if err != nil {
			fmt.Println("Error updating itmes nbr of folder:", err)
			return "", err
		}
		return result, nil
	}
	result, err := collection.InsertOne(c, folder)
	if err != nil {
		fmt.Println("Error inserting folder metadata into MongoDB:", err)
		return "", err
	}
	fmt.Printf("Folder inserted with ID: %v\n", result.(string))
	return result.(string), nil
}

func (s *fileRepository) updateNbrItemsInFolder(c context.Context, foldername string) (string, error) {
	collection := s.database.Collection(database.FOLDER.String())
	folder := fabric.FolderMetadata{}
	err := collection.FindOne(c, bson.M{"name": foldername}).Decode(&folder)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", errors.New("folder does not exist in MongoDB. Cannot update item count")
		}
		fmt.Println("Error finding folder in MongoDB:", err)
		return "", err
	}
	update := bson.M{"$inc": bson.M{"nbrItems": 1}}
	result, err := collection.UpdateOne(c, bson.M{"name": foldername}, update)
	if err != nil {
		fmt.Println("Error updating folder item count in MongoDB:", err)
		return "", err
	}
	if result.MatchedCount == 0 {
		return "", errors.New("no matching folder found")
	}
	fmt.Printf("Folder %s updated, nbrItems incremented to %d\n", foldername, folder.NbrItems+1)
	return folder.ID, nil
}

func (s *fileRepository) getFileByHash(ctx context.Context, hashFile string) (*fabric.FileMetadata, error) {
	collection := s.database.Collection(database.FILE.String())
	var file fabric.FileMetadata
	err := collection.FindOne(ctx, bson.M{"hash_file": hashFile}).Decode(&file)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("No file found with the given ID.")
			return nil, nil
		}
		fmt.Println("Error retrieving file from MongoDB:", err)
		return nil, err
	}
	return &file, nil
}

func (s *fileRepository) GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error) {
	// fabric.SdkProvider("deleteAll")
	if s.sftpClient == nil {
		return nil, fmt.Errorf("sftp client is not initialized")
	}
	folder := &fabric.FolderMetadata{
		Name: foldername,
	}
	log.Println(folder)
	result, err := fabric.SdkProvider("getAllByFolderName", folder)
	if err != nil {
		return nil, err
	}
	files, ok := result.(*[]fabric.FileMetadata)
	if !ok {
		return nil, fmt.Errorf("failed to convert result to []fabric.FileMetadata")
	}
	location := "/cnr/uploads/" + folder.Name + "/"

	for i := range *files {
		file := &(*files)[i]
		filePath := location + file.FileName

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
		filedb, err := s.getFileByHash(c, file.HashFile)
		if err != nil {
			return nil, fmt.Errorf("error in loading file from db")
		}
		if file.HashFile == checksum {
			file.Status = "Valid"
			if filedb.IsChanged == "true" {
				nr := notificationsRepo.NewNotificationRepository(s.database)
				notificationMessage := fmt.Sprintf("Le fichier '%s' est maintenant valide. Le hash correspond.", file.FileName)
				receivers := make(map[string]bool)
				receivers[file.UserID] = true
				if file.ReciverId != "" {
					receivers[file.ReciverId] = true
				}
				for _, taggedUser := range file.TaggedUsers {
					receivers[taggedUser] = true
				}
				var uniqueReceivers []string
				for receiver := range receivers {
					uniqueReceivers = append(uniqueReceivers, receiver)
				}
				notification := &feature.Notification{
					Receivers: uniqueReceivers,
					Title:     "Fichier validé",
					Message:   notificationMessage,
					Time:      time.Now(),
					SenderId:  file.UserID,
					Path:      filepath.Join("/home/peer", file.UserID, file.Folder),
				}
				_, err = nr.AddNotification(c, *notification)
				if err != nil {
					log.Printf("Error sending notification about file becoming valid: %v", err)
				}
				file.IsChanged = ""
				collection := s.database.Collection(database.FILE.String())
				_, err = collection.UpdateOne(c,
					bson.M{"id": file.ID},
					bson.M{"$set": bson.M{"isChanged": ""}},
				)
				if err != nil {
					log.Printf("Error updating isChanged in database: %v", err)
				}
			}
		} else {
			file.Status = "Invalid"
			if filedb.IsChanged == "" {
				nr := notificationsRepo.NewNotificationRepository(s.database)
				notificationMessage := fmt.Sprintf("Le fichier '%s' a été détecté comme invalide. Le hash ne correspond pas.", file.FileName)

				receivers := make(map[string]bool)
				receivers[file.UserID] = true
				if file.ReciverId != "" {
					receivers[file.ReciverId] = true
				}
				for _, taggedUser := range file.TaggedUsers {
					receivers[taggedUser] = true
				}

				var uniqueReceivers []string
				for receiver := range receivers {
					uniqueReceivers = append(uniqueReceivers, receiver)
				}

				notification := &feature.Notification{
					Receivers: uniqueReceivers,
					Title:     "Fichier invalide détecté",
					Message:   notificationMessage,
					Time:      time.Now(),
					SenderId:  file.UserID,
					Path:      filepath.Join("/home/peer", file.UserID, file.Folder),
				}

				_, err = nr.AddNotification(c, *notification)
				if err != nil {
					log.Printf("Error sending notification about invalid file: %v", err)
				}

				file.IsChanged = "true"
				collection := s.database.Collection(database.FILE.String())
				_, err = collection.UpdateOne(c,
					bson.M{"id": file.ID},
					bson.M{"$set": bson.M{"isChanged": "true"}},
				)
				if err != nil {
					log.Printf("Error updating isChanged in database: %v", err)
				}
			}
		}
		(*files)[i] = *file
	}
	return files, nil
}

func (r *fileRepository) DownloadFiles(c context.Context, files []entities.Data) (map[string][]string, error) {
	versionRepo := versionRepo.NewVersionRepository(r.database, r.sftpClient)
	result := make(map[string][]string)
	versions := &[]fabric.FileMetadata{}
	var err error
	for _, file := range files {
		var allPaths []string
		if file.Path != nil {
			if file.Status == "Valid" {
				allPaths = append(allPaths, *file.Path)
			}
		} else {
			log.Println("file.Path is nil for file:", file.FileName)
			continue
		}

		versions, err = versionRepo.GetMetadataVersionByParentFile(c, "", file.FileName)
		if err != nil {
			log.Printf("Failed to get versions for %s: %v", file.FileName, err)
		}

		if versions != nil && len(*versions) > 0 {
			for _, version := range *versions {
				if version.Path != "" {
					if version.Status == "Valid" {
						allPaths = append(allPaths, version.Path)
					}
				}
			}
		}

		result[file.FileName] = allPaths
	}

	return result, nil
}

func (r *fileRepository) DownloadFilesOfFolder(c context.Context, folder string) (map[string][]string, error) {
	versionRepo := versionRepo.NewVersionRepository(r.database, r.sftpClient)
	result := make(map[string][]string)
	versions := &[]fabric.FileMetadata{}
	var err error

	files, err := r.GetMetadataFileByFolderName(c, folder)
	if err != nil {
		return nil, fmt.Errorf("failed to get files from folder: %v", err)
	}

	for _, file := range *files {
		var allPaths []string

		if file.Path != "" {
			// if _, err := os.Stat(file.Path); err == nil {
			if file.Status == "Valid" {
				allPaths = append(allPaths, file.Path)
			}
			// }
		}

		versions, err = versionRepo.GetMetadataVersionByParentFile(c, "", file.FileName)
		if err != nil {
			log.Printf("Failed to get versions for %s: %v", file.FileName, err)
		}

		if versions != nil && len(*versions) > 0 {
			for _, version := range *versions {
				if version.Path != "" {
					// if _, err := os.Stat(version.Path); err == nil {
					if version.Status == "Valid" {
						allPaths = append(allPaths, version.Path)
					}
					// }
				}
			}
		}

		if len(allPaths) > 0 {
			result[file.FileName] = allPaths
		}
	}

	return result, nil
}
