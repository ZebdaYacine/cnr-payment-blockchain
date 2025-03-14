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
	UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error)
	GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error)
}

func NewFileRepository(db database.Database) FileRepository {
	return &fileRepository{
		database: db,
	}
}
func (s *fileRepository) UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error) {
	fileID := uuid.New()
	folderID := uuid.New()

	if file.Folder == "" {
		file.Folder = fmt.Sprintf("%02d-%02d", time.Now().Month(), time.Now().Day())
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

	fileMetaData := &fabric.FileMetadata{
		ID:           fileID.String(),
		HashFile:     checksum,
		UserID:       file.UserId,
		FileName:     file.Name,
		Parent:       file.Parent,
		Version:      strconv.Itoa(file.Version),
		Time:         time.Now().Format(time.RFC3339),
		Action:       file.Action,
		Folder:       file.Folder,
		Description:  file.Description,
		Organisation: file.Organisation,
		Path:         output,
		Destination:  file.Destination,
	}

	folderMetaData := &fabric.FolderMetadata{
		ID:           folderID.String(),
		Name:         file.Folder,
		Path:         folderPath,
		NbrItems:     1,
		UserId:       file.UserId,
		Destination:  file.Destination,
		Organisation: file.Organisation,
		CreateAt:     time.Now().Format(time.RFC3339),
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

func (s *fileRepository) GetMetadataFileByFolderName(c context.Context, foldername string) (*[]fabric.FileMetadata, error) {
	// fabric.SdkProvider("deleteAll")
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
	location := "../../ftp/" + folder.Name + "/"
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
