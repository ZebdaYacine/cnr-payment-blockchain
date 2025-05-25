package email

import (
	"crypto/rand"
	"fmt"
	"scps-backend/pkg"

	"gopkg.in/gomail.v2"
)

func GenerateDigit() (string, error) {
	n := 6
	digits := make([]byte, n)
	_, err := rand.Read(digits)
	if err != nil {
		return "", err
	}

	for i := 0; i < n; i++ {
		digits[i] = digits[i]%10 + '0'
	}
	return string(digits), nil
}

func SendEmail(to string, subject string, body string) error {
	var SETTING = pkg.GET_SMTP_SERVER_SETTING()
	m := gomail.NewMessage()
	m.SetHeader("From", SETTING.SMTP_USER)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)
	d := gomail.NewDialer(SETTING.SMTP_HOST, SETTING.SMTP_PORT, SETTING.SMTP_USER, SETTING.SMTP_PASS)

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		return err
	}
	fmt.Println("Email sent successfully!")
	return nil
}
