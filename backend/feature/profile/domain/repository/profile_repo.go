package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/feature"
	"scps-backend/pkg/database"
	"scps-backend/util"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type profileRepository struct {
	database database.Database
}

// GetAllDemand implements ProfileRepository.

type ProfileRepository interface {
	UploadFile(c context.Context, filename string, codebase64 string) (string, error)
	UpdateDemand(c context.Context, user *feature.User) (*feature.User, error)
	GetProfile(c context.Context, userId string) (*feature.User, error)
	GetInformationCard(c context.Context, userId string) (*feature.User, error)
	ReciveDemand(c context.Context, user *feature.User) (*feature.User, error)
	GetAllDemand(c context.Context) ([]*feature.User, error)
}

func NewProfileRepository(db database.Database) ProfileRepository {
	return &profileRepository{
		database: db,
	}
}

func (s *profileRepository) UploadFile(c context.Context, filename string, codebase64 string) (string, error) {
	err := util.Base64ToFile(codebase64, "output.txt")
	if err != nil {
		return "", err
	}
	return "OK", nil
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
func (s *profileRepository) GetAllDemand(c context.Context) ([]*feature.User, error) {

	collection := s.database.Collection("user")
	filter := bson.D{{Key: "request", Value: true}, {Key: "permission", Value: "USER"}}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find documents: %w", err)
	}
	defer cursor.Close(c)

	var users []*feature.User
	for cursor.Next(c) {
		var result bson.M
		if err := cursor.Decode(&result); err != nil {
			log.Printf("failed to decode document: %v", err)
			continue
		}
		if result["status"].(string) != "accepted" {
			user := feature.User{
				Id:     result["_id"].(primitive.ObjectID).Hex(),
				Email:  result["email"].(string),
				Status: result["status"].(string),
			}
			users = append(users, &user)
		}
	}
	return users, nil
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
		Request:    result["request"].(bool),
		Status:     result["status"].(string),
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
