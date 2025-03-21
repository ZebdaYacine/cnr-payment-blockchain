package database

type CollectionName int

const (
	USER CollectionName = iota
	AGENCE
	CCR
	INSTITUTIONS
	FILE
	FOLDER
	NOTIFICATION
)

func (col CollectionName) String() string {
	names := []string{"user", "agence", "ccr", "institution", "file", "folder", "notification"}
	if int(col) < len(names) {
		return names[col]
	}
	return "UNKNOWN"
}
