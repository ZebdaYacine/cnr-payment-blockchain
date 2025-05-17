package servers

import (
	"fmt"
	"scps-backend/pkg"

	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

func ConnectSFTP() (*sftp.Client, error) {
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
