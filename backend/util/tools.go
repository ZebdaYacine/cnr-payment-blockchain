package util

import "crypto/rand"

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
