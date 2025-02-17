package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/core"
	"scps-backend/feature"
	domain "scps-backend/feature/auth/domain/entities"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type authRepository struct {
	database database.Database
}

type AuthRepository interface {
	Login(c context.Context, data *domain.Login) (*feature.User, error)
	CreateAccount(c context.Context, user *feature.User) (*feature.User, error)
	SetPassword(c context.Context, pwd string, eamil string) (bool, error)
	SearchIfEamilExiste(c context.Context, email string) (*feature.User, error)
}

func NewAuthRepository(db database.Database) AuthRepository {
	return &authRepository{
		database: db,
	}
}

func getUser(filter any, collection database.Collection, c context.Context) (*feature.User, error) {
	var result bson.M
	err := collection.FindOne(c, filter).Decode(&result)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	user := feature.User{}
	user = feature.User{
		Id:           result["_id"].(primitive.ObjectID).Hex(),
		Email:        result["email"].(string),
		UserName:     result["username"].(string),
		Permission:   result["permission"].(string),
		WorkAt:       result["WorkAt"].(string),
		IdInstituion: result["idInstituion"].(string),
	}
	return &user, nil
}

// CreateProfile implements ProfileRepository.
func (s *authRepository) CreateAccount(c context.Context, user *feature.User) (*feature.User, error) {
	collection := s.database.Collection("user")
	user.Request = false
	user.Status = ""
	log.Println(user)
	resulat, err := collection.InsertOne(c, &user)
	if err != nil {
		log.Printf("Failed to create user: %v", err)
		return nil, err
	}
	userId := resulat.(string)
	user.Id = userId
	id, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		log.Fatal(err)
	}
	filterUpdate := bson.D{{Key: "_id", Value: id}}
	update := bson.M{
		"$set": user,
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
	return new_user, nil
}

func (r *authRepository) Login(c context.Context, data *domain.Login) (*feature.User, error) {
	// fabric.SdkProvider("getAll")
	collection := r.database.Collection("user")
	filter := bson.D{{Key: "username", Value: data.UserName}, {Key: "password", Value: data.Password}}
	user, err := getUser(filter, collection, c)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	return user, nil
}

func (r *authRepository) SetPassword(c context.Context, pwd string, email string) (bool, error) {
	collection := r.database.Collection("user")
	filterUpdate := bson.D{{Key: "email", Value: email}}
	update := bson.M{
		"$set": bson.M{
			"password": pwd,
		},
	}
	_, err := core.UpdateDoc[feature.User](c, collection, update, filterUpdate)
	if err == nil {
		return true, nil
	}
	return false, err
}

func (r *authRepository) SearchIfEamilExiste(c context.Context, email string) (*feature.User, error) {
	collection := r.database.Collection("user")
	filter := bson.D{{Key: "email", Value: email}}
	user, err := getUser(filter, collection, c)
	if err != nil {
		//log.Print(err)
		return nil, err
	}
	return user, nil
}
