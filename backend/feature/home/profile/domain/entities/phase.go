package entities

type Phase struct {
	ID          string `bson:"_id,omitempty" json:"id"`
	Name        string `bson:"name" json:"name"`
	Description string `bson:"description" json:"description"`
	Number      int    `bson:"number" json:"number"`
	StartAt int `bson:"startAt" json:"startAt"`
	EndAt   int `bson:"endAt" json:"endAt"`
}
