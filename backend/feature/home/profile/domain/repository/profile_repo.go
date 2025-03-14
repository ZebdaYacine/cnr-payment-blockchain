package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/fabric"
	"scps-backend/feature"
	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type profileRepository struct {
	database database.Database
}

// GetAllDemand implements ProfileRepository.
type ProfileRepository interface {
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetFolders(c context.Context) (*[]entities.Folder, error)
}

func NewProfileRepository(db database.Database) ProfileRepository {
	return &profileRepository{
		database: db,
	}
}

func (r *profileRepository) GetProfile(c context.Context, userId string) (*feature.User, error) {
	var result bson.M
	id, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		log.Fatal(err)
	}
	filter := bson.D{{Key: "_id", Value: id}}
	collection := r.database.Collection(database.USER.String())
	err = collection.FindOne(c, filter).Decode(&result)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	user := feature.User{
		Permission:   result["permission"].(string),
		Email:        result["email"].(string),
		UserName:     result["username"].(string),
		WorkAt:       result["workAt"].(string),
		IdInstituion: result["idInstituion"].(string),
	}

	return &user, nil
}

func (s *profileRepository) GetFolders(c context.Context) (*[]entities.Folder, error) {
	var folders []entities.Folder
	cursor, err := s.database.Collection(database.FOLDER.String()).Find(c, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(c)
	for cursor.Next(c) {
		var folder entities.Folder
		if err := cursor.Decode(&folder); err != nil {
			log.Println("Error decoding folder:", err)
			continue
		}
		folders = append(folders, folder)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	res, err := fabric.SdkProvider("get-folder", &fabric.FolderMetadata{
		Destination: "POST",
	})
	if err != nil {
		fmt.Println("Error getting folders from Fabric Ledger:", err)
		return nil, err
	}
	fmt.Println(res)
	res, err = fabric.SdkProvider("getAll")
	if err != nil {
		fmt.Println("Error adding files from Fabric Ledger:", err)
		return nil, err
	}
	fmt.Println(res)

	return &folders, nil
}
