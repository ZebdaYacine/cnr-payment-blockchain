package servers

import (
	"fmt"
	"io"
	"os"
	"scps-backend/pkg"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

func AccessToSFTP(localFilePath, remoteFileName string) error {
	// Step 1: Connect to SFTP server
	sftpClient, err := connectSFTP()
	if err != nil {
		return fmt.Errorf("SFTP connection error: %w", err)
	}
	defer sftpClient.Close()
	fmt.Println("SFTP connection established.")

	// Step 2: Open local file
	localFile, err := os.Open(localFilePath)
	if err != nil {
		return fmt.Errorf("cannot open local file: %w", err)
	}
	defer localFile.Close()

	// Step 3: Create remote file
	remotePath := "/home/" + os.Getenv("SFTP_USER") + "/" + remoteFileName
	remoteFile, err := sftpClient.Create(remotePath)
	if err != nil {
		return fmt.Errorf("cannot create remote file: %w", err)
	}
	defer remoteFile.Close()

	// Step 4: Copy local to remote
	if _, err := io.Copy(remoteFile, localFile); err != nil {
		return fmt.Errorf("cannot upload file: %w", err)
	}

	fmt.Println("✅ File uploaded successfully to", remotePath)
	return nil
}

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
