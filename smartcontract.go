package chaincode

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

// SmartContract provides functions for managing FileFileMetadata
type SmartContract struct {
	contractapi.Contract
}

// FileMetadata defines the structure for FileMetadata information
type FileMetadata struct {
	ID           string   `json:"ID"`
	HashFile     string   `json:"HashFile"`
	UserID       string   `json:"UserID"`
	FileName     string   `json:"FileName"`
	Folder       string   `json:"Folder"`
	Parent       string   `json:"Parent"`
	Version      string   `json:"Version"`
	LastVersion  string   `json:"LastVersion"`
	Action       string   `json:"Action"`
	Time         string   `json:"Time"`
	Organisation string   `json:"Organisation"`
	Path         string   `json:"Path"`
	Destination  string   `json:"Destination"`
	ReciverId    string   `json:"ReciverId"`
	TaggedUser   []string `json:"TaggedUsers"`
	Description  string   `json:"Description",omitempty"`
	Commit       string   `json:"Commit",omitempty"`
}

type FolderMetadata struct {
	ID           string   `json:"ID"`
	UserID       string   `json:"UserID"`
	Name         string   `json:"Name"`
	Path         string   `json:"Path" `
	NbrItems     int      `json:"NbrItems"`
	Destination  string   `json:"Destination"`
	Organisation string   `json:"Organisation"`
	CreateAt     string   `json:"CreateAt"`
	ReciverId    string   `json:"ReciverId"`
	TaggedUser   []string `json:"TaggedUsers"`
}

// Constants for valid actions and organisations
const (
	Upload   = "upload"
	Download = "download"
)

// Validate action
func isValidAction(action string) bool {
	return action == Upload || action == Download
}

// CreateFileMetadata creates a new FileMetadata entry in the ledger
func (s *SmartContract) CreateFileMetadata(ctx contractapi.TransactionContextInterface, id, hashFile, userID, FileName, Parent, Version, LastVersion, action, organisation, FolderName, Path, Destination, ReciverId, taggedUsersJSON string) error {
	if !isValidAction(action) {
		return fmt.Errorf("invalid action: %s. Valid actions are 'upload' or 'download'", action)
	}
	exists, err := s.FileMetadataExists(ctx, hashFile)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("FileMetadata %s already exists", hashFile)
	}
	var taggedUsers []string
	err = json.Unmarshal([]byte(taggedUsersJSON), &taggedUsers)
	if err != nil {
		return fmt.Errorf("failed to unmarshal TaggedUsers: %v", err)
	}

	FileMetadata := FileMetadata{
		ID:           id,
		HashFile:     hashFile,
		UserID:       userID,
		Action:       action,
		FileName:     FileName,
		Parent:       Parent,
		Version:      Version,
		LastVersion:  LastVersion,
		Folder:       FolderName,
		Path:         Path,
		Time:         time.Now().Format(time.RFC3339),
		Organisation: organisation,
		Destination:  Destination,
		ReciverId:    ReciverId,
		TaggedUser:   taggedUsers,
	}
	FileMetadataJSON, err := json.Marshal(FileMetadata)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(hashFile, FileMetadataJSON)
}

func (s *SmartContract) CreateVersionMetadata(ctx contractapi.TransactionContextInterface, HashParent, id, hashFile, userID, FileName, Parent, Version, LastVersion, action, organisation, FolderName, Path, Destination, ReciverId, taggedUsersJSON, commit, description string) error {
	if !isValidAction(action) {
		return fmt.Errorf("invalid action: %s. Valid actions are 'upload' or 'download'", action)
	}

	exists, err := s.FileMetadataExists(ctx, hashFile)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("FileMetadata %s already exists", hashFile)
	}
	var taggedUsers []string
	err = json.Unmarshal([]byte(taggedUsersJSON), &taggedUsers)
	if err != nil {
		return fmt.Errorf("failed to unmarshal TaggedUsers: %v", err)
	}

	FileMetadata := FileMetadata{
		ID:           id,
		HashFile:     hashFile,
		UserID:       userID,
		Action:       action,
		FileName:     FileName,
		Parent:       Parent,
		Version:      Version,
		LastVersion:  LastVersion,
		Folder:       FolderName,
		Path:         Path,
		Time:         time.Now().Format(time.RFC3339),
		Organisation: organisation,
		Destination:  Destination,
		ReciverId:    ReciverId,
		TaggedUser:   taggedUsers,
		Commit:       commit,
		Description:  description,
	}
	FileMetadataJSON, err := json.Marshal(FileMetadata)
	if err != nil {
		return err
	}
	// _, err = s.UpdateLastVersionFile(ctx, Parent, HashParent, LastVersion)
	// if err != nil {
	// 	return err
	// }
	return ctx.GetStub().PutState(hashFile, FileMetadataJSON)
}

// ReadFileMetadata returns FileMetadata with the given ID
func (s *SmartContract) ReadFileMetadata(ctx contractapi.TransactionContextInterface, id string) (*FileMetadata, error) {
	FileMetadataJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if FileMetadataJSON == nil {
		return nil, fmt.Errorf("FileMetadata %s does not exist", id)
	}

	var FileMetadata FileMetadata
	err = json.Unmarshal(FileMetadataJSON, &FileMetadata)
	if err != nil {
		return nil, err
	}

	return &FileMetadata, nil
}

// UpdateFileMetadata updates an existing FileMetadata entry
func (s *SmartContract) UpdateFileMetadata(ctx contractapi.TransactionContextInterface, id, hashFile, userID, action, FileName, Parent, Version, LastVersion, organisation, FolderName, Path, Destination string, ReciverId string, TaggedUserJson, description string) error {
	if !isValidAction(action) {
		return fmt.Errorf("invalid action: %s. Valid actions are 'upload' or 'download'", action)
	}

	exists, err := s.FileMetadataExists(ctx, hashFile)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("FileMetadata %s does not exist with this hash", hashFile)
	}
	var taggedUsers []string = []string{}
	if TaggedUserJson != "" && TaggedUserJson != "[]" {
		if !json.Valid([]byte(TaggedUserJson)) {
			return fmt.Errorf("TaggedUserJson is not a valid JSON array: %s", TaggedUserJson)
		}
		err := json.Unmarshal([]byte(TaggedUserJson), &taggedUsers)
		if err != nil {
			return fmt.Errorf("failed to unmarshal TaggedUsers: %v", err)
		}
	}

	FileMetadata := FileMetadata{
		ID:           id,
		HashFile:     hashFile,
		UserID:       userID,
		Action:       action,
		FileName:     FileName,
		Parent:       Parent,
		Version:      Version,
		LastVersion:  LastVersion,
		Folder:       FolderName,
		Path:         Path,
		Time:         time.Now().Format(time.RFC3339),
		Organisation: organisation,
		Destination:  Destination,
		ReciverId:    ReciverId,
		TaggedUser:   taggedUsers,
		Description:  description,
	}
	FileMetadataJSON, err := json.Marshal(FileMetadata)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(hashFile, FileMetadataJSON)
}

// GetFileMetadataByName retrieves a file by its hashFile
func (s *SmartContract) GetFileMetadataByHashFile(ctx contractapi.TransactionContextInterface, hashFile string) (*FileMetadata, error) {
	if hashFile == "" {
		return nil, fmt.Errorf("hash file cannot be empty")
	}
	fileMetadataJSON, err := ctx.GetStub().GetState(hashFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if fileMetadataJSON == nil {
		return nil, fmt.Errorf("FileMetadata %s does not exist with this name", hashFile)
	}

	var fileMetadata FileMetadata
	err = json.Unmarshal(fileMetadataJSON, &fileMetadata)
	if err != nil {
		return nil, err
	}

	return &fileMetadata, nil
}

// UpdateLastVersionFile retrieves all versions of a file by its hashFile
func (s *SmartContract) UpdateLastVersionFile(ctx contractapi.TransactionContextInterface, parent, lastVersion, hashParent string) ([]*FileMetadata, error) {
	files, err := s.GetFileMetadataByParentName(ctx, parent)
	if err != nil {
		return nil, fmt.Errorf("failed to get files for parent %s: %w", parent, err)
	}

	fileParent, err := s.GetFileMetadataByHashFile(ctx, hashParent)
	if err != nil {
		return nil, fmt.Errorf("file does not exist with hashFile %s: %w", hashParent, err)
	}

	updateFileVersion := func(file *FileMetadata) error {
		taggedUser := "[]"
		if len(file.TaggedUser) > 0 {
			taggedUserJSON, err := json.Marshal(file.TaggedUser)
			if err != nil {
				return fmt.Errorf("failed to marshal tagged users: %w", err)
			}
			taggedUser = string(taggedUserJSON)
		}

		file.LastVersion = lastVersion
		return s.UpdateFileMetadata(ctx, file.ID, file.HashFile, file.UserID, file.Action,
			file.FileName, file.Parent, file.Version, file.LastVersion,
			file.Organisation, file.Folder, file.Path, file.Destination, file.ReciverId, taggedUser)
	}

	for _, file := range files {
		if err := updateFileVersion(file); err != nil {
			return nil, err
		}
	}

	if err := updateFileVersion(fileParent); err != nil {
		return nil, err
	}

	return files, nil
}

func (s *SmartContract) GetFileMetadataByParentName(ctx contractapi.TransactionContextInterface, parent string) ([]*FileMetadata, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var fileMetadataList []*FileMetadata

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var fileMetadata FileMetadata
		err = json.Unmarshal(queryResponse.Value, &fileMetadata)
		if err != nil {
			return nil, err
		}

		if fileMetadata.Parent == parent && fileMetadata.HashFile != "" {
			fileMetadataList = append(fileMetadataList, &fileMetadata)
		}
	}

	if len(fileMetadataList) == 0 {
		return nil, fmt.Errorf("no FileMetadata found for FolderName: %s", parent)
	}

	return fileMetadataList, nil
}

// DeleteFileMetadata deletes FileMetadata from the ledger
func (s *SmartContract) DeleteFileMetadata(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.FileMetadataExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("FileMetadata %s does not exist", id)
	}

	return ctx.GetStub().DelState(id)
}

// FileMetadataExists checks if FileMetadata exists in the ledger
func (s *SmartContract) FileMetadataExists(ctx contractapi.TransactionContextInterface, hash string) (bool, error) {
	FileMetadataJSON, err := ctx.GetStub().GetState(hash)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return FileMetadataJSON != nil, nil
}

// DeleteAllFileMetadata removes all FileMetadata records from the ledger
func (s *SmartContract) DeleteAllFileMetadata(ctx contractapi.TransactionContextInterface) error {
	// Retrieve all records
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return fmt.Errorf("failed to retrieve records: %v", err)
	}
	defer resultsIterator.Close()

	// Iterate and delete each entry
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return fmt.Errorf("failed to iterate over records: %v", err)
		}

		err = ctx.GetStub().DelState(queryResponse.Key)
		if err != nil {
			return fmt.Errorf("failed to delete key %s: %v", queryResponse.Key, err)
		}
	}

	return nil
}

// GetAllFileMetadata retrieves all FileMetadata from the ledger
func (s *SmartContract) GetAllFileMetadata(ctx contractapi.TransactionContextInterface) ([]*FileMetadata, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var FileMetadataList []*FileMetadata
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var FileMetadata FileMetadata
		err = json.Unmarshal(queryResponse.Value, &FileMetadata)
		if err != nil {
			return nil, err
		}
		if FileMetadata.HashFile != "" {
			FileMetadataList = append(FileMetadataList, &FileMetadata)

		}
	}

	return FileMetadataList, nil
}

func (s *SmartContract) GetFileMetadataByFolderName(ctx contractapi.TransactionContextInterface, folderName string) ([]*FileMetadata, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var fileMetadataList []*FileMetadata

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var fileMetadata FileMetadata
		err = json.Unmarshal(queryResponse.Value, &fileMetadata)
		if err != nil {
			return nil, err
		}

		if fileMetadata.Folder == folderName && fileMetadata.HashFile != "" {
			fileMetadataList = append(fileMetadataList, &fileMetadata)
		}
	}

	if len(fileMetadataList) == 0 {
		return nil, fmt.Errorf("no FileMetadata found for FolderName: %s", folderName)
	}

	return fileMetadataList, nil
}

func (s *SmartContract) GetFileMetadataByReceiverId(ctx contractapi.TransactionContextInterface, ReciverId string) ([]*FileMetadata, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var fileMetadataList []*FileMetadata

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var fileMetadata FileMetadata
		err = json.Unmarshal(queryResponse.Value, &fileMetadata)
		if err != nil {
			return nil, err
		}

		if fileMetadata.ReciverId == ReciverId && fileMetadata.HashFile != "" {
			fileMetadataList = append(fileMetadataList, &fileMetadata)
		}
	}
	if len(fileMetadataList) == 0 {
		return nil, fmt.Errorf("no FileMetadata found for ReciverId: %s", ReciverId)
	}
	return fileMetadataList, nil
}

// TransferFileMetadata transfers the FileMetadata ownership
func (s *SmartContract) TransferFileMetadata(ctx contractapi.TransactionContextInterface, id, newUserID string) (string, error) {
	FileMetadata, err := s.ReadFileMetadata(ctx, id)
	if err != nil {
		return "", err
	}

	oldUserID := FileMetadata.UserID
	FileMetadata.UserID = newUserID
	FileMetadata.Time = time.Now().Format(time.RFC822)

	FileMetadataJSON, err := json.Marshal(FileMetadata)
	if err != nil {
		return "", fmt.Errorf("failed to marshal updated FileMetadata: %v", err)
	}

	err = ctx.GetStub().PutState(id, FileMetadataJSON)
	if err != nil {
		return "", fmt.Errorf("failed to update FileMetadata in world state: %v", err)
	}

	return oldUserID, nil
}

// CreateFolderMetadata creates a new FolderMetadata entry in the ledger
func (s *SmartContract) CreateFolderMetadata(ctx contractapi.TransactionContextInterface, id, userID, name, path, Destination, Organisation, ReciverId string, TaggedUserJson string) error {
	exists, err := s.FolderMetadataExists(ctx, name)
	if err != nil {
		return err
	}
	if exists {
		folder, err := s.GetFolderMetadataByName(ctx, name)
		if err != nil {
			return err
		}
		folder.NbrItems = folder.NbrItems + 1
		return s.UpdateFolderMetadata(ctx, folder.ID, folder.UserID,
			folder.Name, folder.Path, folder.Destination, folder.Organisation, folder.CreateAt, folder.NbrItems, ReciverId, TaggedUserJson)
	}
	var taggedUsers []string
	err = json.Unmarshal([]byte(TaggedUserJson), &taggedUsers)
	if err != nil {
		return fmt.Errorf("failed to unmarshal TaggedUsers: %v", err)
	}
	folderMetadata := FolderMetadata{
		ID:           id,
		UserID:       userID,
		Name:         name,
		Path:         path,
		Destination:  Destination,
		Organisation: Organisation,
		NbrItems:     1,
		CreateAt:     time.Now().Format(time.RFC3339),
		ReciverId:    ReciverId,
		TaggedUser:   taggedUsers,
	}
	folderMetadataJSON, err := json.Marshal(folderMetadata)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(name, folderMetadataJSON)
}

// UpdateFolderMetadata updates an existing FolderMetadata entry
func (s *SmartContract) UpdateFolderMetadata(ctx contractapi.TransactionContextInterface, id, userID, name, path, Destination, Organisation, CreateAt string, nbrItems int, ReciverId string, TaggedUserJson string) error {
	exists, err := s.FolderMetadataExists(ctx, name)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("FolderMetadata %s does not exist", name)
	}
	var taggedUsers []string
	err = json.Unmarshal([]byte(TaggedUserJson), &taggedUsers)
	if err != nil {
		return fmt.Errorf("failed to unmarshal TaggedUsers: %v", err)
	}
	folderMetadata := FolderMetadata{
		ID:           id,
		UserID:       userID,
		Name:         name,
		Path:         path,
		Destination:  Destination,
		Organisation: Organisation,
		NbrItems:     nbrItems,
		CreateAt:     CreateAt,
		ReciverId:    ReciverId,
		TaggedUser:   taggedUsers,
	}

	folderMetadataJSON, err := json.Marshal(folderMetadata)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(name, folderMetadataJSON)
}

// GetFolderMetadataByDestAndOrg retrieves all FolderMetadata for a given Destination
func (s *SmartContract) GetFolderMetadataByRS(ctx contractapi.TransactionContextInterface, senderId string, receiverId string) ([]*FolderMetadata, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var folderMetadataList []*FolderMetadata

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var folderMetadata FolderMetadata
		err = json.Unmarshal(queryResponse.Value, &folderMetadata)
		if err != nil {
			return nil, err
		}

		if folderMetadata.UserID == senderId &&
			(folderMetadata.ReciverId == receiverId ||
				includes(folderMetadata.TaggedUser, receiverId)) &&
			folderMetadata.Name != "" &&
			folderMetadata.CreateAt != "" {
			folderMetadataList = append(folderMetadataList, &folderMetadata)
		}
	}

	if len(folderMetadataList) == 0 {
		return nil, fmt.Errorf("no FolderMetadata found for Destination: %s", senderId)
	}

	return folderMetadataList, nil
}

func includes[T comparable](slice []T, value T) bool {
	for _, item := range slice {
		if item == value {
			return true
		}
	}
	return false
}

// GetFolderMetadataByName retrieves a FolderMetadata by its name
func (s *SmartContract) GetFolderMetadataByName(ctx contractapi.TransactionContextInterface, name string) (*FolderMetadata, error) {
	if name == "" {
		return nil, fmt.Errorf("folder name cannot be empty")
	}
	folderMetadataJSON, err := ctx.GetStub().GetState(name)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if folderMetadataJSON == nil {
		return nil, fmt.Errorf("FolderMetadata %s does not exist with this name", name)
	}

	var folderMetadata FolderMetadata
	err = json.Unmarshal(folderMetadataJSON, &folderMetadata)
	if err != nil {
		return nil, err
	}

	return &folderMetadata, nil
}

// FolderMetadataExists checks if FolderMetadata exists in the ledger
func (s *SmartContract) FolderMetadataExists(ctx contractapi.TransactionContextInterface, name string) (bool, error) {
	folderMetadataJSON, err := ctx.GetStub().GetState(name)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return folderMetadataJSON != nil, nil
}
