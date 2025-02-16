package entities

type UploadVersion struct {
	Name         string `json:"filename"`
	CodeBase64   string `json:"codebase64"`
	Action       string `json:"action"`
	Version      int    `json:"version"`
	Parent       string `json:"parent"`
	Note         int    `json:"note"`
	Path         string `json:"path"`
	Organisation string `json:"organisation"`
	UserId       string
}
