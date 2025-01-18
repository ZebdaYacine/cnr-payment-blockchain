package entities

type Register struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Login struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

type InformationsCard struct {
	SecurityId string `json:"securityId"`
}

type SetEmail struct {
	Email string `json:"email"`
}

type ReciveOTP struct {
	Otp string `json:"otp"`
}

type SetPwd struct {
	Email string `json:"email"`
	Pwd1  string `json:"pwd1"`
	Pwd2  string `json:"pwd2"`
}
