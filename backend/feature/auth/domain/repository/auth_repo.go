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
	SetPassword(c context.Context, pwd string, email string) (bool, error)
	SearchIfEamilExiste(c context.Context, email string) (*feature.User, error)
	UserExiste(c context.Context, identifier string) (bool, error)
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
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("utilisateur introuvable")
		}
		log.Print(err)
		return nil, fmt.Errorf("erreur lors de la récupération de l'utilisateur")
	}

	user := feature.User{
		Id:           result["_id"].(primitive.ObjectID).Hex(),
		Email:        result["email"].(string),
		UserName:     result["username"].(string),
		Permission:   result["permission"].(string),
		Password:     result["password"].(string),
		WorkAt:       result["workAt"].(string),
		IdInstituion: result["idInstituion"].(string),
	}
	return &user, nil
}

func (s *authRepository) CreateAccount(c context.Context, user *feature.User) (*feature.User, error) {
	collection := s.database.Collection("user")
	result, err := collection.InsertOne(c, &user)
	if err != nil {
		log.Printf("Échec de la création de l'utilisateur : %v", err)
		return nil, fmt.Errorf("échec de la création du compte utilisateur")
	}

	insertedID, ok := result.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("erreur lors de la conversion de l'identifiant utilisateur")
	}

	user.Id = insertedID.Hex()

	filterUpdate := bson.D{{Key: "_id", Value: insertedID}}
	update := bson.M{"$set": user}

	_, err = collection.UpdateOne(c, filterUpdate, update)
	if err != nil {
		log.Printf("Erreur lors de la mise à jour de l'utilisateur : %v", err)
		return nil, fmt.Errorf("échec de la mise à jour de l'utilisateur")
	}

	newUser := &feature.User{}
	err = collection.FindOne(c, filterUpdate).Decode(newUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("utilisateur non trouvé après création")
		}
		return nil, fmt.Errorf("erreur lors de la récupération du nouvel utilisateur")
	}
	return newUser, nil
}

func (r *authRepository) Login(c context.Context, data *domain.Login) (*feature.User, error) {
	u, err := r.SearchIfEamilExiste(c, data.UserName)
	if err != nil {
		log.Print(err)
		return nil, fmt.Errorf("adresse e-mail incorrecte ou utilisateur inexistant")
	}

	if u.Password != data.Password {
		return nil, fmt.Errorf("mot de passe incorrect")
	}
	u.Password = ""

	return u, nil
}

func (r *authRepository) SetPassword(c context.Context, pwd string, email string) (bool, error) {
	collection := r.database.Collection("user")
	filterUpdate := bson.D{{Key: "email", Value: email}}
	update := bson.M{
		"$set": bson.M{"password": pwd},
	}
	_, err := core.UpdateDoc[feature.User](c, collection, update, filterUpdate)
	if err != nil {
		return false, fmt.Errorf("échec de la mise à jour du mot de passe")
	}
	return true, nil
}

func (r *authRepository) SearchIfEamilExiste(c context.Context, email string) (*feature.User, error) {
	collection := r.database.Collection("user")
	filter := bson.D{{Key: "email", Value: email}}
	user, err := getUser(filter, collection, c)
	if err != nil {
		return nil, fmt.Errorf("aucun utilisateur trouvé avec l'adresse e-mail : %s", email)
	}
	return user, nil
}

func (r *authRepository) UserExiste(c context.Context, identifier string) (bool, error) {
	collection := r.database.Collection("user")

	filter := bson.M{
		"$or": []bson.M{
			{"email": identifier},
			{"username": identifier},
		},
	}

	count, err := collection.CountDocuments(c, filter)
	if err != nil {
		log.Printf("Erreur lors de la vérification de l'existence de l'utilisateur : %v", err)
		return false, fmt.Errorf("erreur lors de la vérification de l'existence de l'utilisateur")
	}

	return count > 0, nil
}
