package feature

import (
	"scps-backend/feature/auth/domain/entities"
	fileEntities "scps-backend/feature/home/file/domain/entities"
	institutionsEntities "scps-backend/feature/home/institutions/domain/entities"
	profileEntities "scps-backend/feature/home/profile/domain/entities"
	"time"

	versionEntities "scps-backend/feature/home/version/domain/entities"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Id           string             `json:"id" bson:"id"`
	Email        string             `json:"email" bson:"email"`
	Password     string             `json:"password" bson:"password"`
	UserName     string             `json:"username" bson:"username"`
	IdInstituion string             `json:"idInstituion" bson:"idInstituion"`
	WorkAt       string             `json:"workAt" bson:"workAt"`
	Type         string             `json:"type" bson:"type"`
	Permission   string             `json:"permission" bson:"permission"`
	Wilaya       string             `json:"wilaya" bson:"wilaya"`
	Phases       []string           `json:"phases" bson:"phases"`
	PublicKey    string             `json:"publicKey" bson:"publicKey"`
	CreateAt     time.Time          `json:"createAt" bson:"createAt"`
	LastName     string             `json:"last_name" bson:"last_name"`
	FirstName    string             `json:"first_name" bson:"first_name"`
	Avatar       string             `json:"avatar" bson:"avatar"`
}

type Notification struct {
	ID        string    `json:"id" bson:"_id,omitempty"`
	SenderId  string    `json:"sender,omitempty" bson:"sender"`
	Sender    User      ` bson:"sender_name"`
	Receivers []string  `json:"receiverId" bson:"receiverId"`
	Message   string    `json:"message" bson:"message"`
	Title     string    `json:"title" bson:"title"`
	Time      time.Time `json:"time" bson:"time"`
	Path      string    `json:"path" bson:"path"`
	IsRead    bool      `json:"is_read" bson:"is_read"`
}

type Agence struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
	Code string `json:"code,omitempty" bson:"code,omitempty"`
	CCR  *CCR   `json:"parent,omitempty" bson:"parent,omitempty"`
}

type CCR struct {
	ID     string       `json:"id" bson:"id"`
	Name   string       `json:"name" bson:"name"`
	Code   string       `json:"code,omitempty" bson:"code,omitempty"`
	Parent *Instiutiont `json:"parent,omitempty" bson:"parent,omitempty"`
}

type Instiutiont struct {
	ID     string       `json:"id" bson:"id"`
	Name   string       `json:"name" bson:"name"`
	Parent *Instiutiont `json:"parent,omitempty" bson:"parent,omitempty"`
}

type Peer struct {
	Obj  interface{} `json:"obj"`
	Type string      `json:"type"`
}

type Elements struct {
	Institutiont Peer   `json:"institutiont"`
	Child        []Peer `json:"child"`
}

type Son struct {
	InsurdNbr string  `json:"insurdNbr" bson:"insurdNbr"`
	Status    string  `json:"status" bson:"status"`
	Name      string  `json:"name" bson:"name"`
	Visit     []Visit `json:"visit" bson:"visit"`
}

type Visit struct {
	Nbr       int `json:"nbr" bson:"nbr"`
	Trimester int `json:"trimester" bson:"trimester"`
}

type Account interface {
	User | entities.Login | entities.SetEmail | CCR |
		Agence | Instiutiont |
		entities.ReciveOTP | entities.SetPwd |
		profileEntities.InformationsCard |
		profileEntities.Link | institutionsEntities.GetInstitution |
		entities.Register | profileEntities.UpdateProfile |
		fileEntities.UploadFile | versionEntities.UploadVersion | Notification
}
