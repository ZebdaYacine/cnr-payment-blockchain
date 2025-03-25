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

type UploadFile struct {
	Name         string   `json:"filename"`
	CodeBase64   string   `json:"codebase64"`
	Action       string   `json:"action"`
	Version      int      `json:"version"`
	Parent       string   `json:"parent"`
	Folder       string   `json:"folder"`
	Description  string   `json:"description"`
	Organisation string   `json:"organisation"`
	Destination  string   `json:"destination"`
	UserId       string   `json:"userid" bson:"user_id"`
	ReciverId    string   `json:"reciverId" bson:"reciverId"`
	TaggedUser   []string `json:"tagged_users" bson:"tagged_users"`
	Phase        string   `json:"phase" bson:"phase"`
	Path         string
}

type DownloadFile struct {
	FileIDs []string `json:"filePaths"`
}
