package feature

import (
	"scps-backend/feature/auth/domain/entities"
	profileEntities "scps-backend/feature/profile/domain/entities"
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
		profileEntities.InformationsCard | profileEntities.Link |
		entities.Register | profileEntities.UpdateProfile | profileEntities.UploadFile
}
