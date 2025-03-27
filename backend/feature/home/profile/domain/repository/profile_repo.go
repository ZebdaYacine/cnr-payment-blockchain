package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"scps-backend/fabric"
	"scps-backend/feature"
	"scps-backend/feature/home/profile/domain/entities"
	"scps-backend/pkg/database"
	"time"

	"encoding/base64"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type profileRepository struct {
	database database.Database
}

type ProfileRepository interface {
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetFolders(c context.Context, folder *fabric.FolderMetadata) (*[]entities.Folder, error)
	GetCurrentPhase(c context.Context) (*entities.Phase, error)
	GetRandomString() (string, error)
	VerifySigitalSignature(signature string) bool
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
		log.Printf("❌ Invalid user ID format: %s\n", userId)
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}
	filter := bson.D{{Key: "_id", Value: id}}
	collection := r.database.Collection(database.USER.String())
	err = collection.FindOne(c, filter).Decode(&result)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	var phases []string
	if rawPhases, ok := result["phases"].(primitive.A); ok {
		for _, p := range rawPhases {
			if s, ok := p.(string); ok {
				phases = append(phases, s)
			}
		}
	} else {
		log.Printf("⚠️ Could not cast phases for user %s\n", userId)
	}

	user := feature.User{
		ID:           id,
		Id:           userId,
		Permission:   result["permission"].(string),
		Email:        result["email"].(string),
		UserName:     result["username"].(string),
		WorkAt:       result["workAt"].(string),
		IdInstituion: result["idInstituion"].(string),
		Type:         result["type"].(string),
		Wilaya:       result["wilaya"].(string),
		Phases:       phases,
	}

	return &user, nil
}

func (s *profileRepository) GetFolders(c context.Context, folder *fabric.FolderMetadata) (*[]entities.Folder, error) {
	var folders []entities.Folder
	// fabric.SdkProvider("getAll", folder)
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
	log.Println(">>>>>>>>>>>>>>>>>>>>>>>", fabricFolders)
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

func (r *profileRepository) GetCurrentPhase(c context.Context) (*entities.Phase, error) {
	collection := r.database.Collection(database.PHASE.String())

	// Get current time
	now := time.Now()

	// Create filter to find phase where current time is between startAt and endAt
	filter := bson.M{
		"startAt": bson.M{"$lte": now.Day()},
		"endAt":   bson.M{"$gte": now.Day()},
	}

	// Find the current phase
	var phase entities.Phase
	err := collection.FindOne(c, filter).Decode(&phase)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println("⚠️ No active phase found for current time")
			return nil, fmt.Errorf("no active phase found")
		}
		log.Printf("❌ Error getting current phase: %v\n", err)
		return nil, fmt.Errorf("error getting current phase: %w", err)
	}

	log.Printf("✅ Found current phase: %s\n", phase.Name)
	return &phase, nil
}

func (r *profileRepository) GetRandomString() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random string: %w", err)
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

func (r *profileRepository) VerifySigitalSignature(signature string) bool {
	// Validate inputs

	return true
}
