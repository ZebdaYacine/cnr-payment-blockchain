package repository

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"path"

	"github.com/pkg/sftp"
)

func AccessBase64ToSFTP(base64Content, remoteFilePath string, sftpClient *sftp.Client) error {

	fmt.Println("SFTP connection established.")

	decodedContent, err := base64.StdEncoding.DecodeString(base64Content)
	if err != nil {
		return fmt.Errorf("error decoding base64: %w", err)
	}
	fmt.Println("Decoding file", decodedContent)
	remoteDir := path.Dir( remoteFilePath) // example: /cnr/uploads/2025-04-27
	err = sftpClient.MkdirAll(remoteDir)
	if err != nil {
		return fmt.Errorf("cannot create remote directories: %w", err)
	}
	remoteFile, err := sftpClient.Create(remoteFilePath)
	if err != nil {
		return fmt.Errorf("cannot create remote file: %w", err)
	}
	defer remoteFile.Close()

	reader := bytes.NewReader(decodedContent)
	if _, err := io.Copy(remoteFile, reader); err != nil {
		return fmt.Errorf("cannot upload base64 decoded content: %w", err)
	}

	fmt.Println("✅ Base64 file uploaded successfully to", remoteFilePath)
	return nil
}
