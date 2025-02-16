package feature

import (
	"scps-backend/feature/auth/domain/entities"
	institutionsEntities "scps-backend/feature/home/institutions/domain/entities"
	profileEntities "scps-backend/feature/home/profile/domain/entities"

	versionEntities "scps-backend/feature/home/version/domain/entities"
)

type User struct {
	Id       string `json:"id" bson:"id"`
	Email    string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
	UserName string `json:"username" bson:"username"`

	// Phone      string `json:"phone" bson:"phone"`
	Permission string `json:"permission" bson:"permission"`
	// Son        []Son   `json:"son,omitempty" bson:"son,omitempty"`
	Request bool   `json:"request,omitempty" bson:"request"`
	Status  string `json:"status,omitempty" bson:"status"`
}

type Instiutiont struct {
	ID   string `json:"ID" bson:"ID"`
	Name string `json:"Name" bson:"name"`
}

type Child struct {
	ID     string       `json:"ID" bson:"ID"`
	Name   string       `json:"Name" bson:"name"`
	Parent *Instiutiont `json:"Parent" bson:"Parent"`
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
	User | entities.Login | entities.SetEmail |
		entities.ReciveOTP | entities.SetPwd |
		profileEntities.InformationsCard | profileEntities.Link | institutionsEntities.Institution |
		entities.Register | profileEntities.UpdateProfile | profileEntities.UploadFile | versionEntities.UploadVersion
}
