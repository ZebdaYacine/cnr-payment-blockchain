package repository

import (
	"context"
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
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
	"encoding/pem"

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
	VerifyDigitalSignature(signature string, randomValue string, publicKey string) bool
	SendDigitalSignature(fileId string, signature string, cert string, token string, permission string) error
	AddPK(userId string, pk string) error
	UpdateFirstLastName(userId string, firstName string, lastName string, avatar string) error
	UpdatePassword(userId string, oldPassword string, newPassword string) error
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
	var avatar string
	if result["avatar"] == nil {
		avatar = ""
	} else {
		avatar = result["avatar"].(string)
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
		PublicKey:    result["publicKey"].(string),
		CreateAt:     result["createAt"].(primitive.DateTime).Time(),
		LastName:     result["last_name"].(string),
		FirstName:    result["first_name"].(string),
		Avatar:       avatar,
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

func (r *profileRepository) VerifyDigitalSignature(signature string, randomValue string, publicKeyPem string) bool {
	// Decode the base64 signature
	log.Println("SE----------------", signature)
	log.Println("RV----------------", randomValue)
	signatureBytes, err := base64.StdEncoding.DecodeString(signature)
	if err != nil {
		log.Printf("❌ Error decoding signature: %v\n", err)
		return false
	}
	// Decode the PEM-formatted public key
	block, _ := pem.Decode([]byte(publicKeyPem))
	if block == nil || block.Type != "PUBLIC KEY" {
		log.Println("❌ Failed to decode PEM block containing public key")
		return false
	}

	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		log.Printf("❌ Error parsing public key: %v\n", err)
		return false
	}

	pubKey, ok := pubInterface.(*rsa.PublicKey)
	if !ok {
		log.Println("❌ Not an RSA public key")
		return false
	}

	// Hash the random value
	hasher := sha256.New()
	hasher.Write([]byte(randomValue))
	hashed := hasher.Sum(nil)

	// ✅ Correct: Verify using PKCS#1 v1.5 (default in node-forge)
	err = rsa.VerifyPKCS1v15(pubKey, crypto.SHA256, hashed, signatureBytes)
	if err != nil {
		log.Printf("❌ Signature verification failed: %v\n", err)
		return false
	}

	log.Println("✅ Signature verified successfully")
	return true
}

func (r *profileRepository) SendDigitalSignature(fileId string, signature string, cert string, token string, permission string) error {
	// Implementation of SendDigitalSignature method
	return nil
}

func (r *profileRepository) AddPK(userId string, pk string) error {
	id, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	filter := bson.D{{Key: "_id", Value: id}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "publicKey", Value: pk},
			{Key: "createAt", Value: time.Now()},
		}},
	}

	collection := r.database.Collection(database.USER.String())

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

func (r *profileRepository) UpdateFirstLastName(userId string, firstName string, lastName string, avatar string) error {
	id, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	filter := bson.D{{Key: "_id", Value: id}}

	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "first_name", Value: firstName},
			{Key: "last_name", Value: lastName},
			{Key: "avatar", Value: avatar},
		}},
	}

	collection := r.database.Collection(database.USER.String())

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

func (r *profileRepository) UpdatePassword(userId string, oldPassword string, newPassword string) error {
	id, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	filter := bson.D{{Key: "_id", Value: id}}

	// First verify the old password
	var user bson.M
	collection := r.database.Collection(database.USER.String())
	err = collection.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	if user["password"].(string) != oldPassword {
		return fmt.Errorf("old pwd  not correct: %w", err)

	}
	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "password", Value: newPassword},
		}},
	}

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
