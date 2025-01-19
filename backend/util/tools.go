package util

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"strings"
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

func Base64ToFile(base64Str, outputPath string) error {
	parts := strings.Split(base64Str, ",")
	codebase64 := ""
	if len(parts) == 2 {
		// mimeType := parts[0]
		codebase64 = parts[1]
		// fmt.Println("MIME Type:", mimeType)
		// fmt.Println("Base64 Content:", base64Content)
	} else {
		fmt.Println("Invalid string format")
	}
	data, err := base64.StdEncoding.DecodeString(codebase64)
	if err != nil {
		return fmt.Errorf("failed to decode Base64 string: %w", err)
	}
	err = ioutil.WriteFile(outputPath, data, 0644)
	if err != nil {
		return fmt.Errorf("failed to write file: %w", err)
	}

	return nil
}
