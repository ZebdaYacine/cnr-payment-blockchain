package fabric

type FileMetadata struct {
	ID           string `json:"ID"`
	HashFile     string `json:"HashFile"`
	UserID       string `json:"UserID"`
	FileName     string `json:"FileName"`
	Parent       string `json:"Parent"`
	Version      string `json:"Version"`
	Action       string `json:"Action"`
	Folder       string `json:"Folder",omitempty"`
	Description  string `json:"Description",omitempty"`
	Time         string `json:"Time"`
	Organisation string `json:"Organisation"`
	Status       string `json:"Status",omitempty"`
}
