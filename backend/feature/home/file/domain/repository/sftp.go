package repository

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
	"scps-backend/pkg"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

func connectSFTP() (*sftp.Client, error) {
	host := pkg.GET_SFTP_SEETING().SFTP_HOST
	user := pkg.GET_SFTP_SEETING().SFTP_USER
	pass := pkg.GET_SFTP_SEETING().SFTP_PASS

	if host == "" || user == "" || pass == "" {
		return nil, fmt.Errorf("SFTP credentials not set in environment variables")
	}

	sshConfig := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(pass),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(), // Replace in real prod with known_hosts check
	}

	conn, err := ssh.Dial("tcp", host, sshConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to dial SSH: %w", err)
	}

	client, err := sftp.NewClient(conn)
	if err != nil {
		return nil, fmt.Errorf("failed to create SFTP client: %w", err)
	}

	return client, nil
}

func AccessBase64ToSFTP(base64Content, remoteFilePath string) error {
	sftpClient, err := connectSFTP()
	if err != nil {
		return fmt.Errorf("SFTP connection error: %w", err)
	}
	defer sftpClient.Close()
	fmt.Println("SFTP connection established.")

	decodedContent, err := base64.StdEncoding.DecodeString(base64Content)
	if err != nil {
		return fmt.Errorf("error decoding base64: %w", err)
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
