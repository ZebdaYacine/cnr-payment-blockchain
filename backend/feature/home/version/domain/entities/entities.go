package entities

type UploadVersion struct {
	Name        string `json:"filename"`
	CodeBase64  string `json:"codebase64"`
	Action      string `json:"action"`
	Version     int    `json:"version"`
	Parent      string `json:"parent"`
	Folder      string `json:"folderName"`
	Commit      string `json:"commit"`
	Description string `json:"description"`
	UserId      string
}
