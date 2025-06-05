package entities

type Register struct {
	FName    string `json:"f_name"`
	LName    string `json:"l_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Org      string `json:"org"`
	Wilaya   string `json:"wilaya"`
}

type Login struct {
	UserName string `json:"email"`
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
