package feature

import (
	"scps-backend/feature/auth/domain/entities"
	institutionsEntities "scps-backend/feature/home/institutions/domain/entities"
	profileEntities "scps-backend/feature/home/profile/domain/entities"

	versionEntities "scps-backend/feature/home/version/domain/entities"
)

type User struct {
	Id           string `json:"id" bson:"id"`
	Email        string `json:"email" bson:"email"`
	Password     string `json:"password" bson:"password"`
	UserName     string `json:"username" bson:"username"`
	IdInstituion string `json:"idInstituion" bson:"idInstituion"`
	WorkAt       string `json:"WorkAt" bson:"WorkAt"`

	// Phone      string `json:"phone" bson:"phone"`
	Permission string `json:"permission" bson:"permission"`
	// Son        []Son   `json:"son,omitempty" bson:"son,omitempty"`
	Request bool   `json:"request,omitempty" bson:"request"`
	Status  string `json:"status,omitempty" bson:"status"`
}

type Agence struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
	Code string `json:"code" bson:"code"`
	CCR  *CCR   `json:"parent,omitempty" bson:"parent,omitempty"`
}

type CCR struct {
	ID     string       `json:"id" bson:"id"`
	Name   string       `json:"name" bson:"name"`
	Code   string       `json:"code" bson:"code"`
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
		profileEntities.UploadFile | versionEntities.UploadVersion
}
