package entities

import "time"

type Notification struct {
	ID        string    `json:"id" bson:"_id,omitempty"` // assuming id is MongoDB document _id
	Sender    string    `json:"sender,omitempty" bson:"sender"`
	Receivers []string  `json:"receiverId" bson:"receiverId"`
	Message   string    `json:"message" bson:"message"`
	Time      time.Time `json:"time" bson:"time"`
}
