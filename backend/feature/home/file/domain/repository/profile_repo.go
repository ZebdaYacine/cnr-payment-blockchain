package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/fabric"
	"scps-backend/feature"
	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/pkg/database"
	"scps-backend/util"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type profileRepository struct {
	database database.Database
}

// GetAllDemand implements ProfileRepository.
type ProfileRepository interface {
	SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error)
	UploadFile(c context.Context, file entities.UploadFile) (*[]fabric.FileMetadata, error)
	UpdateDemand(c context.Context, user *feature.User) (*feature.User, error)
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetInformationCard(c context.Context, userId string) (*feature.User, error)
	ReciveDemand(c context.Context, user *feature.User) (*feature.User, error)
	GetMetadataFile(c context.Context) (*[]fabric.FileMetadata, error)
}

func NewProfileRepository(db database.Database) ProfileRepository {
	return &profileRepository{
		database: db,
	}
}

func (s *profileRepository) UploadFile(c context.Context, file entities.UploadFile) (*[]fabric.FileMetadata, error) {
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

func (s *profileRepository) SaveMetaDataFile(c context.Context, metadata *fabric.FileMetadata) (*fabric.FileMetadata, error) {
	// collection := s.database.Collection("metadata-file")
	// resulat, err := collection.InsertOne(c, &metadata)
	// if err != nil {
	// 	log.Printf("Failed to create metadata-file: %v", err)
	// 	return nil, err
	// }
	return nil, nil
}

func (s *profileRepository) ReciveDemand(c context.Context, user *feature.User) (*feature.User, error) {
	collection := s.database.Collection("user")
	id, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		log.Fatal(err)
	}
	filterUpdate := bson.D{{Key: "_id", Value: id}}
	update := bson.M{
		"$set": bson.M{
			"request": user.Request,
			"status":  user.Status,
		},
	}
	_, err = collection.UpdateOne(c, filterUpdate, update)
	if err != nil {
		log.Panic(err)
		return nil, err
	}
	new_user := &feature.User{}
	err = collection.FindOne(c, filterUpdate).Decode(new_user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	println(new_user)
	return new_user, nil
}

func (s *profileRepository) GetMetadataFile(c context.Context) (*[]fabric.FileMetadata, error) {
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

func (s *profileRepository) UpdateDemand(c context.Context, user *feature.User) (*feature.User, error) {
	collection := s.database.Collection("user")
	filterUpdate := bson.D{{Key: "insurdNbr", Value: ""}}
	update := bson.M{
		"$set": bson.M{
			"request": user.Request,
			"status":  user.Status,
		},
	}
	_, err := collection.UpdateOne(c, filterUpdate, update)
	if err != nil {
		log.Panic(err)
		return nil, err
	}
	new_user := &feature.User{}
	err = collection.FindOne(c, filterUpdate).Decode(new_user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return new_user, nil
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
		Permission: result["permission"].(string),
		Email:      result["email"].(string),
		UserName:   result["username"].(string),
	}

	return &user, nil
}

func (r *profileRepository) GetInformationCard(c context.Context, userId string) (*feature.User, error) {
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
		Permission: result["permission"].(string),
		Email:      result["email"].(string),
	}
	return &user, nil
}

func convertObject(data interface{}) []feature.Visit {
	var visits []feature.Visit
	for _, visitItem := range data.(bson.A) {
		visitMap := visitItem.(primitive.M)

		nbr := visitMap["nbr"]
		trimester := visitMap["trimester"]

		var visitNbr int
		var visitTrimester int

		switch v := nbr.(type) {
		case int32:
			visitNbr = int(v)
		case int64:
			visitNbr = int(v)
		default:
			visitNbr = nbr.(int)
		}

		switch v := trimester.(type) {
		case int32:
			visitTrimester = int(v)
		case int64:
			visitTrimester = int(v)
		default:
			visitTrimester = trimester.(int) // fall back to int
		}

		visits = append(visits, feature.Visit{
			Nbr:       visitNbr,
			Trimester: visitTrimester,
		})
	}
	return visits
}
