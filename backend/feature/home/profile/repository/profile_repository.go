type ProfileRepository interface {
	GetProfile(userId string) (*User, error)
	GetFolders(folder *fabric.FolderMetadata) (*fabric.FolderMetadata, error)
	GetCurrentPhase() (*Phase, error)
	AddPK(userId string, pk string) error
	UpdateFirstLastName(userId string, firstName string, lastName string, avatar string) error
	UpdatePassword(userId string, oldPassword string, newPassword string) error
	VerifyDigitalSignature(userId string, signature string, randomValue string) error
	GetAllUsers() ([]*User, error)
	UpdateUserType(userId string, newType string) error
	UpdateUserStatus(userId string, status bool) error
}

func (p *profileRepository) UpdateUserType(userId string, newType string) error {
	// Update user type in the database
	query := `UPDATE users SET type = $1 WHERE id = $2`
	_, err := p.db.Exec(query, newType, userId)
	if err != nil {
		return err
	}
	return nil
}

func (p *profileRepository) UpdateUserStatus(userId string, status bool) error {
	// Update user status in the database
	query := `UPDATE users SET status = $1 WHERE id = $2`
	_, err := p.db.Exec(query, status, userId)
	if err != nil {
		return err
	}
	return nil
} 