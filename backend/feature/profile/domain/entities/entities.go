package entities

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
