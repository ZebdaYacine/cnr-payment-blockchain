package repository

import (
	"context"
	"fmt"
	"log"
	"os"
	"scps-backend/fabric"
	"scps-backend/feature"
	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type profileRepository struct {
	database database.Database
}

// GetAllDemand implements ProfileRepository.
type ProfileRepository interface {
	SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error)
	UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error)
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetMetadataFile(c context.Context) (*[]fabric.FileMetadata, error)
	GetFolders(c context.Context) (*[]entities.Folder, error)
}

func NewProfileRepository(db database.Database) ProfileRepository {
	return &profileRepository{
		database: db,
	}
}

func (s *profileRepository) UploadFile(c context.Context, file entities.UploadFile) (*fabric.FileMetadata, error) {
	currentTime := time.Now()
	formattedTime := currentTime.Format("2006-01-02 15:04:05") // YYYY-MM-DD HH:MM:SS format
	fmt.Println("Formatted Date and Time:", formattedTime)
	if file.Folder == "" {
		file.Folder = fmt.Sprintf("%02d-%02d", currentTime.Month(), currentTime.Day())
	}
	folderPath := "../../ftp/" + file.Folder
	err := os.MkdirAll(folderPath, os.ModePerm)
	if err != nil {
		fmt.Println("Error creating folder:", err)
	}
	output := folderPath + "/" + file.Name
	err = util.Base64ToFile(file.CodeBase64, output)
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
		Time:         currentTime.GoString(),
		Action:       file.Action,
		Folder:       file.Folder,
		Description:  file.Description,
		Organisation: file.Organisation,
	}

	// fabric.SdkProvider("deleteAll", metadata)
	_, err = fabric.SdkProvider("add", metadata)
	if err != nil {
		return nil, err
	}
	return metadata, err
}

func (s *profileRepository) SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error) {
	// collection := s.database.Collection("metadata-file")
	// resulat, err := collection.InsertOne(c, &metadata)
	// if err != nil {
	// 	log.Printf("Failed to create metadata-file: %v", err)
	// 	return nil, err
	// }
	return nil, nil
}

func (s *profileRepository) GetMetadataFile(c context.Context) (*[]fabric.FileMetadata, error) {
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
		filesPath := location + file.Folder + "/" + file.FileName
		if !util.FileExists(filesPath) {
			log.Printf("File not found: %s", filesPath)
			file.Status = "Deleted"
			continue
		}
		checksum, err := util.CalculateChecksum(filesPath)
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

func (r *profileRepository) GetProfile(c context.Context, userId string) (*feature.User, error) {
	var result bson.M
	id, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		log.Fatal(err)
	}
	filter := bson.D{{Key: "_id", Value: id}}
	collection := r.database.Collection("user")
	err = collection.FindOne(c, filter).Decode(&result)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	user := feature.User{
		Permission:   result["permission"].(string),
		Email:        result["email"].(string),
		UserName:     result["username"].(string),
		WorkAt:       result["WorkAt"].(string),
		IdInstituion: result["idInstituion"].(string),
	}

	return &user, nil
}

func (s *profileRepository) GetFolders(c context.Context) (*[]entities.Folder, error) {
	location := "../../ftp/"
	folderList := []entities.Folder{}
	files, err := os.ReadDir(location)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return &folderList, err
	}

	fmt.Println("Files in", err)
	for _, file := range files {
		if file.IsDir() {
			folderList = append(folderList, entities.Folder{
				Name: file.Name(),
			})
		}
	}
	return &folderList, nil
}
