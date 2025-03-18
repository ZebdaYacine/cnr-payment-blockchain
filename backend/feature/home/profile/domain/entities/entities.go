package entities

import "time"

type InformationsCard struct {
	SecurityId string `json:"securityId"`
}

type Link struct {
	LinkFile string `json:"linkfile"`
}

type UpdateProfile struct {
	InsurdNbr string `json:"insurdNbr"`
	Request   bool   `json:"request"`
	Status    string `json:"status"`
}

type UploadFile struct {
	Name         string `json:"filename"`
	CodeBase64   string `json:"codebase64"`
	Action       string `json:"action"`
	Version      int    `json:"version"`
	Parent       string `json:"parent"`
	Folder       string `json:"folder"`
	Description  string `json:"description"`
	Organisation string `json:"organisation"`
	UserId       string
}

type VersionFile struct {
	CodeBase64   string `json:"codebase64"`
	Action       string `json:"action"`
	Version      int    `json:"version"`
	Parent       string `json:"parent"`
	Folder       string `json:"folder"`
	Description  string `json:"description"`
	Organisation string `json:"organisation"`
	UserId       string
}

type Folder struct {
	ID       string    `json:"id,omitempty" bson:"id,omitempty"`
	Name     string    `json:"name" bson:"name"`
	User     string    `json:"user" bson:"user"`
	Path     string    `json:"path" bson:"path"`
	NbrItems int       `json:"nbrItems" bson:"nbrItems"`
	CreateAt time.Time `json:"createAt" bson:"createAt"`
}
