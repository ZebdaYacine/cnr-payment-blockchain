package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	"scps-backend/fabric"
	"scps-backend/feature"
	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/pkg/database"
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
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetFolders(c context.Context, folder *fabric.FolderMetadata) (*[]entities.Folder, error)
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

func (s *profileRepository) GetFolders(c context.Context, folder *fabric.FolderMetadata) (*[]entities.Folder, error) {
	var folders []entities.Folder
	// cursor, err := s.database.Collection(database.FOLDER.String()).Find(c, bson.M{
	// 	"organisation": folder.Organisation,
	// 	"Destination":  folder.Destination,
	// })
	// if err != nil {
	// 	log.Println("🚨 MongoDB Query Error:", err)
	// 	return nil, err
	// }
	// defer cursor.Close(c)

	// for cursor.Next(c) {
	// 	var folder entities.Folder
	// 	if err := cursor.Decode(&folder); err != nil {
	// 		log.Println("❌ Error decoding folder:", err)
	// 		continue // Continue processing even if decoding fails for one document
	// 	}
	// 	folders = append(folders, folder)
	// }

	// if err := cursor.Err(); err != nil {
	// 	log.Println("🚨 Cursor Error:", err)
	// 	return nil, err
	// }

	// if len(folders) == 0 {
	// 	log.Println("⚠️ No folders found in MongoDB.")
	// 	// Return an empty slice (not nil) to prevent breaking frontend logic
	// 	return &folders, nil
	// }
	res, err := fabric.SdkProvider("get-folder", folder)
	if err != nil {
		log.Println("🚨 Error getting folders from Fabric Ledger:", err)
	}
	fmt.Println("📄 Fabric Ledger Response:", res)
	fabricFolders, ok := res.(*[]fabric.FolderMetadata)
	if !ok {
		log.Println("❌ Failed to convert Fabric response to FolderMetadata slice")
		return &folders, nil
	}
	var convertedFolders []entities.Folder
	if fabricFolders == nil || len(*fabricFolders) == 0 {
		log.Println("⚠️ No folders found in Fabric Ledger.")
		return &folders, nil // Return whatever is available (MongoDB results)
	}

	for _, fabricFolder := range *fabricFolders {
		parsedTime, err := time.Parse(time.RFC3339, fabricFolder.CreateAt)
		if err != nil {
			fmt.Println("❌ Error parsing time:", err)
			return nil, err
		}
		user, err := s.GetProfile(c, fabricFolder.UserId)
		if err != nil {
			if errors.Is(err, mongo.ErrNoDocuments) {
				log.Printf("⚠️ No user found with ID: %s\n", fabricFolder.UserId)
				return nil, nil // Return nil instead of error if no user found
			}
			log.Println("🚨 MongoDB Query Error:", err)
			return nil, err
		}
		convertedFolders = append(convertedFolders, entities.Folder{
			ID:       fabricFolder.ID,
			Name:     fabricFolder.Name,
			Path:     fabricFolder.Path,
			NbrItems: fabricFolder.NbrItems,
			User:     user.UserName,
			CreateAt: parsedTime,
		})
	}
	return &convertedFolders, nil
}
