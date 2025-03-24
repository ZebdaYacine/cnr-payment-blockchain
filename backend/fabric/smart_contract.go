package fabric

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"

	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
)

const (
	mspID        = "Org1MSP"
	cryptoPath   = "../../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com"
	certPath     = cryptoPath + "/users/User1@org1.example.com/msp/signcerts"
	keyPath      = cryptoPath + "/users/User1@org1.example.com/msp/keystore"
	tlsCertPath  = cryptoPath + "/peers/peer0.org1.example.com/tls/ca.crt"
	peerEndpoint = "dns:///localhost:7051"
	gatewayPeer  = "peer0.org1.example.com"
)

// newIdentity creates a client identity for this Gateway connection using an X.509 certificate.
func newIdentity() *identity.X509Identity {
	certificatePEM, err := readFirstFile(certPath)
	if err != nil {
		panic(fmt.Errorf("failed to read certificate file: %w", err))
	}

	certificate, err := identity.CertificateFromPEM(certificatePEM)
	if err != nil {
		panic(err)
	}

	id, err := identity.NewX509Identity(mspID, certificate)
	if err != nil {
		panic(err)
	}

	return id
}

// newSign creates a function that generates a digital signature from a message digest using a private key.
func newSign() identity.Sign {
	privateKeyPEM, err := readFirstFile(keyPath)
	if err != nil {
		panic(fmt.Errorf("failed to read private key file: %w", err))
	}

	privateKey, err := identity.PrivateKeyFromPEM(privateKeyPEM)
	if err != nil {
		panic(err)
	}

	sign, err := identity.NewPrivateKeySign(privateKey)
	if err != nil {
		panic(err)
	}

	return sign
}

func readFirstFile(dirPath string) ([]byte, error) {
	dir, err := os.Open(dirPath)
	if err != nil {
		return nil, err
	}

	fileNames, err := dir.Readdirnames(1)
	if err != nil {
		return nil, err
	}

	return os.ReadFile(path.Join(dirPath, fileNames[0]))
}

// This type of transaction would typically only be run once by an application the first time it was started after its
// initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
func initLedger(contract *client.Contract) {
	fmt.Printf("\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger \n")

	r, err := contract.SubmitTransaction("InitLedger")
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	log.Println(r)

	fmt.Printf("*** Transaction committed successfully\n")
}

// Evaluate a transaction to query ledger state.
func getAllFileMetadata(contract *client.Contract) (*[]FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: GetAllFileMetadata, function returns all the current assets on the ledger")

	evaluateResult, err := contract.EvaluateTransaction("GetAllFileMetadata")
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	if len(evaluateResult) == 0 {
		return nil, fmt.Errorf("❌ no metadata in blockchain network") // Return error instead of panicking
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
	var files *[]FileMetadata
	err1 := json.Unmarshal([]byte(result), &files)
	if err1 != nil {
		log.Fatalf("Error parsing JSON: %v", err1)
	}
	return files, nil
}

func getAllFileMetadataByFolderName(contract *client.Contract, folderName string) (*[]FileMetadata, error) {
	// deleteAllFileMetadata(contract)
	fmt.Println("\n--> Evaluate Transaction: GetFileMetadataByFolderName, function returns all the current assets on the ledger")

	evaluateResult, err := contract.EvaluateTransaction("GetFileMetadataByFolderName", folderName)
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	if len(evaluateResult) == 0 {
		return nil, fmt.Errorf("❌ no metadata in blockchain network") // Return error instead of panicking
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
	var files *[]FileMetadata
	err1 := json.Unmarshal([]byte(result), &files)
	if err1 != nil {
		log.Fatalf("Error parsing JSON: %v", err1)
	}
	return files, nil
}

// Evaluate a transaction to query ledger state.
func getFileMetadata(contract *client.Contract, id string) (*FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: GetFileMetadata, function returns   file on the ledger with id :" + id)

	evaluateResult, err := contract.EvaluateTransaction("ReadFileMetadata", id)
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	if len(evaluateResult) == 0 {
		fmt.Println("❌ no metadata in blockchain network")
		return nil, fmt.Errorf("❌ no metadata in blockchain network") // Return error instead of panicking
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
	var file *FileMetadata
	err1 := json.Unmarshal([]byte(result), &file)
	if err1 != nil {
		log.Fatalf("Error parsing JSON: %v", err1)
		return nil, err1
	}
	return file, nil
}

func deleteAllFileMetadata(contract *client.Contract) error {
	fmt.Println("\n--> Submitting Transaction: DeleteAllFileMetadata - deleting all file metadata from the ledger")

	// Submit transaction
	submitResult, err := contract.SubmitTransaction("DeleteAllFileMetadata")
	if err != nil {
		log.Println("❌ Transaction failed:", err)
		return fmt.Errorf("failed to submit transaction: %w", err) // Return error instead of panicking
	}

	// Confirm transaction success
	fmt.Println("*** ✅ Transaction committed successfully.")
	if len(submitResult) > 0 { // Only print result if there is one
		fmt.Printf("Result: %s\n", string(submitResult))
	}
	return nil
}

func getFileMetadataByParentName(contract *client.Contract, parent string) (*[]FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: getFileMetadataByParentName, function returns all the current assets on the ledger")

	evaluateResult, err := contract.EvaluateTransaction("GetFileMetadataByParentName", parent)
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	if len(evaluateResult) == 0 {
		return nil, fmt.Errorf("❌ no metadata in blockchain network") // Return error instead of panicking
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
	var files *[]FileMetadata
	err1 := json.Unmarshal([]byte(result), &files)
	if err1 != nil {
		log.Fatalf("Error parsing JSON: %v", err1)
	}
	return files, nil
}

func createVersionMetadata(contract *client.Contract, file *FileMetadata, HashParent string) (*FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: createVersionMetadata, function creates metadata for a file on the ledger")

	if HashParent == "" || file.Parent == "" || file.Path == "" || file.Folder == "" || file.ID == "" || file.HashFile == "" || file.UserID == "" || file.FileName == "" || file.Organisation == "" || file.Version == "" || file.LastVersion == "" {
		return nil, fmt.Errorf("❌ missing required fields in file metadata")
	}

	fmt.Printf("Submitting transaction with: HashParent=%s ,ID=%s, HashFile=%s, UserID=%s, FileName=%s, Parent=%s, Version=%s, Action=%s, Organisation=%s, Path=%s, Folder=%s,Destination=%s\n",
		HashParent, file.ID, file.HashFile, file.UserID, file.FileName, file.Parent, file.Version, file.Action, file.Organisation, file.Path, file.Folder, file.Destination)

	taggedUser := "[]"
	if len(file.TaggedUsers) > 0 {
		taggedUserJSON, err := json.Marshal(file.TaggedUsers)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal tagged users: %w", err)
		}
		taggedUser = string(taggedUserJSON)
	}

	// Submit transaction with correct parameters
	_, err := contract.SubmitTransaction(
		"CreateVersionMetadata",
		HashParent, file.ID, file.HashFile, file.UserID, file.FileName,
		file.Parent, file.Version, file.LastVersion, file.Action, file.Organisation,
		file.Folder, file.Path, file.Destination, file.ReciverId,
		taggedUser, file.Commit, file.Description,
	)
	if err != nil {
		return nil, fmt.Errorf("❌ failed to Create Version Metadata transaction: %w", err)
	}
	fmt.Printf("*** ✅  Transaction  CreateVersionMetadata committed successfully")
	fileParent := &FileMetadata{}
	submitResult1, err := contract.SubmitTransaction(
		"GetFileMetadataByHashFile",
		HashParent,
	)
	err = json.Unmarshal(submitResult1, &fileParent)
	if err != nil {
		return nil, err
	}
	fmt.Printf("*** ✅  Transaction Get Parent File committed successfully. Result: %s\n", string(submitResult1))
	if err != nil {
		return nil, fmt.Errorf("❌ failed to Get Parent File  submit transaction: %w", err)
	}
	taggedUserJSON, err := json.Marshal(fileParent.TaggedUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal tagged users: %w", err)
	}
	taggedUser = string(taggedUserJSON)
	_, err = contract.SubmitTransaction(
		"UpdateFileMetadata",
		fileParent.ID, fileParent.HashFile, fileParent.UserID, fileParent.Action, fileParent.FileName,
		fileParent.Parent, fileParent.Version, file.LastVersion, fileParent.Organisation,
		fileParent.Folder, fileParent.Path, fileParent.Destination, fileParent.ReciverId,
		taggedUser, fileParent.Description, "",
		fileParent.Phase,
	)
	if err != nil {
		return nil, fmt.Errorf("❌ >>>>>>>>>>>>failed to submit transaction: %w", err)
	}
	version := []FileMetadata{}
	fmt.Printf("*** ✅  Transaction Get Parent File committed successfully. Result: %s\n", string(submitResult1))
	submitResult0, err := contract.SubmitTransaction(
		"GetFileMetadataByParentName",
		file.Parent,
	)
	err = json.Unmarshal(submitResult0, &version)
	if err != nil {
		return nil, err
	}
	fmt.Printf("*** ✅  Transaction Get all files by  Parent File committed successfully. Result: %s\n", string(submitResult0))

	for _, version := range version {
		_, err = contract.SubmitTransaction(
			"UpdateFileMetadata",
			version.ID, version.HashFile, version.UserID, version.Action, version.FileName,
			version.Parent, version.Version, file.LastVersion, version.Organisation,
			version.Folder, version.Path, version.Destination, version.ReciverId,
			taggedUser, version.Description, version.Commit,
		)
		if err != nil {
			return nil, fmt.Errorf("❌ >>>>>>>>>>>>failed to submit transaction: %w", err)
		}
	}
	fmt.Printf("*** ✅  Transaction Update last_version for all versions ")

	submitResult4, err := contract.SubmitTransaction(
		"GetFileMetadataByHashFile",
		fileParent.HashFile,
	)
	fmt.Printf("*** ✅  Transaction 3 committed successfully. Result: %s\n", string(submitResult4))

	if err != nil {
		return nil, fmt.Errorf("❌ failed to submit transaction: %w", err)
	}

	// Confirm success
	// fmt.Printf("*** ✅  Transaction committed successfully. Result: %s\n", string(submitResult))
	return file, nil
}

func createFileMetadata(contract *client.Contract, file *FileMetadata) (*FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: CreateFileMetadata, function creates metadata for a file on the ledger")

	if file.Parent == "" {
		if file.Destination == "" {
			return nil, fmt.Errorf("❌ missing Destination")
		}
	}

	// Ensure all necessary fields are provided
	if file.Path == "" || file.Folder == "" || file.ID == "" || file.HashFile == "" || file.UserID == "" || file.FileName == "" || file.Organisation == "" || file.Version == "" || file.LastVersion == "" {
		return nil, fmt.Errorf("❌ missing required fields in file metadata")
	}

	fmt.Printf("Submitting transaction with: ID=%s, HashFile=%s, UserID=%s, FileName=%s, Parent=%s, Version=%s, Action=%s, Organisation=%s, Path=%s, Folder=%s,Destination=%s\n",
		file.ID, file.HashFile, file.UserID, file.FileName, file.Parent, file.Version, file.Action, file.Organisation, file.Path, file.Folder, file.Destination)

	taggedUserJSON, err := json.Marshal(file.TaggedUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal tagged users: %w", err)
	}
	taggedUser := string(taggedUserJSON)
	// Submit transaction with correct parameters
	submitResult, err := contract.SubmitTransaction(
		"CreateFileMetadata",
		file.ID, file.HashFile, file.UserID, file.FileName,
		file.Parent, file.Version, file.LastVersion, file.Action, file.Organisation,
		file.Folder, file.Path, file.Destination, file.ReciverId,
		taggedUser, file.Phase,
	)
	if err != nil {
		return nil, fmt.Errorf("❌ failed to submit transaction: %w", err)
	}

	// Confirm success
	fmt.Printf("*** ✅  Transaction committed successfully. Result: %s\n", string(submitResult))
	return file, nil
}

func createFolderMetadata(contract *client.Contract, folder *FolderMetadata) (*FolderMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: createFolderMetadata, function creates metadata for a folder on the ledger")

	// Ensure all necessary fields are provided
	if folder.Path == "" || folder.Name == "" || folder.Destination == "" || folder.Organisation == "" || folder.UserId == "" || folder.ID == "" {
		return nil, fmt.Errorf("❌ missing required fields in folder metadata")
	}

	fmt.Printf("Submitting transaction with: ID=%s, UserID=%s, Name=%s, Path=%s, Destination=%s,Organisation=%s, NbrItems=%d\n",
		folder.ID, folder.UserId, folder.Name, folder.Path, folder.Destination, folder.Organisation, folder.NbrItems)

	taggedUser := "[]"
	if len(folder.TaggedUsers) > 0 {
		taggedUserJSON, err := json.Marshal(folder.TaggedUsers)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal tagged users: %w", err)
		}
		taggedUser = string(taggedUserJSON)
	}
	// Submit transaction for creating folder metadata
	submitResult, err := contract.SubmitTransaction(
		"CreateFolderMetadata",
		folder.ID, folder.UserId, folder.Name, folder.Path,
		folder.Destination, folder.Organisation, folder.ReciverId,
		taggedUser, folder.Phase,
	)
	if err != nil {
		return nil, fmt.Errorf("❌ failed to submit transaction: %w", err)
	}

	// Confirm success
	fmt.Printf("*** ✅  Transaction committed successfully. Result: %s\n", string(submitResult))
	return folder, nil
}

func getFolderMetadataByRS(contract *client.Contract, senderId string, receiverId string) (*[]FolderMetadata, error) {
	// deleteAllFileMetadata(contract)
	fmt.Println("\n--> Evaluate Transaction: getFolderMetadataByRS, function returns all the current Folder by destination on the ledger")

	evaluateResult, err := contract.EvaluateTransaction("GetFolderMetadataByRS", senderId, receiverId)
	if err != nil {
		fmt.Errorf("failed to evaluate transaction: %w", err)
	}
	if len(evaluateResult) == 0 {
		return nil, fmt.Errorf("❌ no metadata in blockchain network") // Return error instead of panicking
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
	var folders *[]FolderMetadata
	err1 := json.Unmarshal([]byte(result), &folders)
	if err1 != nil {
		fmt.Errorf("Error parsing JSON: %v", err1)
	}
	fmt.Printf("*** Folders:>>>>>>>>>>>>>>>", folders)
	return folders, nil
}

func formatJSON(data []byte) string {
	var prettyJSON bytes.Buffer
	if err := json.Indent(&prettyJSON, data, "", "  "); err != nil {
		fmt.Errorf("failed to parse JSON: %w", err)
	}
	return prettyJSON.String()
}
