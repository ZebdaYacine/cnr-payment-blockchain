package fabric

type FileMetadata struct {
	ID           string `json:"ID" bson:"id,omitempty"`
	HashFile     string `json:"HashFile" bson:"hash_file"`
	UserID       string `json:"UserID" bson:"user_id"`
	FileName     string `json:"FileName" bson:"file_name"`
	Parent       string `json:"Parent" bson:"parent"`
	Version      string `json:"Version" bson:"version"`
	Action       string `json:"Action" bson:"action"`
	Folder       string `json:"Folder",omitempty" bson:"folder,omitempty"`
	Description  string `json:"Description",omitempty" bson:"description,omitempty"`
	Time         string `json:"Time" bson:"time"`
	Organisation string `json:"Organisation" bson:"organisation"`
	Status       string `json:"Status",omitempty" bson:"status,omitempty"`
	Path         string `json:"path,omitempty" bson:"path,omitempty"`
}
