package entities

type UploadVersion struct {
	Name         string   `json:"filename"`
	HashParent   string   `json:"hash_parent"`
	CodeBase64   string   `json:"codebase64"`
	Action       string   `json:"action"`
	Version      int      `json:"version"`
	Parent       string   `json:"parent"`
	Folder       string   `json:"folderName"`
	Commit       string   `json:"commit"`
	Description  string   `json:"description"`
	ReciverId    string   `json:"receiverId" `
	TaggedUser   []string `json:"taggedUsers"`
	Organisation string   `json:"organization"`
	Destination  string   `json:"destination"`
	UserId       string
}
