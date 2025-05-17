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
	PHASE
)

func (col CollectionName) String() string {
	names := []string{"user", "agence", "ccr", "institution", "file", "folder", "notification","phase"}
	if int(col) < len(names) {
		return names[col]
	}
	return "UNKNOWN"
}
