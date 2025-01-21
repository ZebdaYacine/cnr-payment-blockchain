package fabric

type FileMetadata struct {
	ID           string `json:"id"`
	HashFile     string `json:"hashFile"`
	UserID       string `json:"userId"`
	Action       string `json:"action"`
	Organisation string `json:"organisation"`
}
