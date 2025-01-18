package model

import "time"

type LoginResponse struct {
	Token    string `json:"token"`
	UserData any    `json:"userdata"`
}

type SetEmailResponse struct {
	Status bool `json:"status"`
}

type SuccessResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type OTPConfirmation struct {
	Reason       string    `json:"reason"`
	Code         string    `json:"code"`
	IP           string    `json:"ip"`
	Time_Sending time.Time `json:"sendingAt"`
	Email        string    `json:"email"`
}
