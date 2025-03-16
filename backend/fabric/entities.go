package fabric

type FileMetadata struct {
	ID           string   `json:"ID" bson:"id,omitempty"`
	HashFile     string   `json:"HashFile" bson:"hash_file"`
	UserID       string   `json:"UserID" bson:"user_id"`
	ReciverId    string   `json:"reciverId" bson:"reciverId"`
	TaggedUsers  []string `json:"TaggedUsers" bson:"tagged_users"`
	FileName     string   `json:"FileName" bson:"file_name"`
	Parent       string   `json:"Parent" bson:"parent"`
	Version      string   `json:"Version" bson:"version"`
	Action       string   `json:"Action" bson:"action"`
	Folder       string   `json:"Folder",omitempty" bson:"folder,omitempty"`
	Description  string   `json:"Description",omitempty" bson:"description,omitempty"`
	Time         string   `json:"Time" bson:"time"`
	Organisation string   `json:"Organisation" bson:"organisation"`
	Status       string   `json:"Status",omitempty" bson:"status,omitempty"`
	Path         string   `json:"path,omitempty" bson:"path,omitempty"`
	Destination  string   `json:"Destination" bson:"Destination"`
}

type FolderMetadata struct {
	ID           string   `json:"id,omitempty" bson:"id,omitempty"`
	Name         string   `json:"name" bson:"name"`
	Path         string   `json:"path" bson:"path"`
	UserId       string   `json:"userId" bson:"userId"`
	ReciverId    string   `json:"reciverId" bson:"reciverId"`
	NbrItems     int      `json:"nbrItems" bson:"nbrItems"`
	CreateAt     string   `json:"createAt" bson:"createAt"`
	Destination  string   `json:"Destination" bson:"Destination"`
	Organisation string   `json:"Organisation" bson:"organisation"`
	TaggedUsers  []string `json:"TaggedUsers" bson:"tagged_users"`
}
