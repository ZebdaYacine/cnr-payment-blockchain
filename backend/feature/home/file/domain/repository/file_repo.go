package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"scps-backend/fabric"
	"scps-backend/feature/home/file/domain/entities"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type fileRepository struct {
	database database.Database
}

// GetAllDemand implements FileRepository.
type FileRepository interface {
	SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error)
	UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error)
	GetMetadataFile(c context.Context, foldername string) (*[]fabric.FileMetadata, error)
	GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error)
}

func NewFileRepository(db database.Database) FileRepository {
	return &fileRepository{
		database: db,
	}
}
func (s *fileRepository) UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error) {
	currentTime := time.Now()
	fileID := uuid.New()

	formattedTime := currentTime.Format("2006-01-02 15:04:05")
	fmt.Println("Formatted Date and Time:", formattedTime)

	if file.Folder == "" {
		file.Folder = fmt.Sprintf("%02d-%02d", currentTime.Month(), currentTime.Day())
	}

	folderPath := "../../ftp/" + file.Folder
	err := os.MkdirAll(folderPath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating folder:", err)
		return nil, err
	}

	output := folderPath + "/" + file.Name
	err = util.Base64ToFile(file.CodeBase64, output)
	if err != nil {
		return nil, fmt.Errorf("error converting Base64 to file: %v", err)
	}

	checksum, err := util.CalculateChecksum(output)
	if err != nil {
		return nil, fmt.Errorf("error calculating checksum: %v", err)
	}

	fmt.Printf("SHA-256 File Checksum: %s\n", checksum)
	fmt.Printf("USER ID: %s\n", file.UserId)

	metadata := &fabric.FileMetadata{
		ID:           fileID.String(),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		Time:         currentTime.Format(time.RFC3339),
		Action:       file.Action,
		Folder:       file.Folder,
		Description:  file.Description,
		Organisation: "DG",
		Path:         output,
	}

	_, err = fabric.SdkProvider("add", metadata)
	if err != nil {
		fmt.Println("Error adding to Fabric Ledger:", err)
		return nil, err
	}

	folderMetadata := entities.Folder{
		Name:     file.Folder,
		Path:     folderPath,
		NbrItems: 1,
		CreateAt: currentTime,
	}

	folderID, err := s.addFolderToDB(c, folderMetadata)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted folder metadata into MongoDB:", folderID)

	fileIDMongo, err := s.addFileToDB(c, *metadata)
	if err != nil {
		return nil, err
	}
	fmt.Println("Inserted file metadata into MongoDB:", fileIDMongo)

	return metadata, nil
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

func (s *fileRepository) addFolderToDB(c context.Context, folder entities.Folder) (string, error) {
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
	folder := entities.Folder{}
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

func (s *fileRepository) SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error) {
	// collection := s.database.Collection("metadata-file")
	// resulat, err := collection.InsertOne(c, &metadata)
	// if err != nil {
	// 	log.Printf("Failed to create metadata-file: %v", err)
	// 	return nil, err
	// }
	return nil, nil
}

func (s *fileRepository) GetMetadataFile(c context.Context, foldername string) (*[]fabric.FileMetadata, error) {
	// fabric.SdkProvider("deleteAll")
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

func (s *fileRepository) GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error) {
	// fabric.SdkProvider("deleteAll")
	file := &fabric.FileMetadata{
		Folder: foldername,
	}
	log.Println(file)
	result, err := fabric.SdkProvider("getAllByFolderName", file)
	if err != nil {
		return nil, err
	}
	files, ok := result.(*[]fabric.FileMetadata)
	if !ok {
		return nil, fmt.Errorf("failed to convert result to []fabric.FileMetadata")
	}
	location := "../../ftp/" + file.Folder + "/"
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
