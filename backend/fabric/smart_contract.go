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
	//deleteAllFileMetadata(contract)
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

func createFileMetadata(contract *client.Contract, file *FileMetadata) (*[]FileMetadata, error) {
	fmt.Println("\n--> Evaluate Transaction: CreateFileMetadata, function creates metadata for a file on the ledger")

	id := file.ID
	hashFile := file.HashFile
	userID := file.UserID
	action := file.Action
	// organisation := file.Organisation
	fileName := file.FileName
	parent := file.Parent
	version := file.Version

	// Submit transaction
	submitResult, err := contract.SubmitTransaction("CreateFileMetadata", id, hashFile, userID, fileName, parent, version, action, "DG")
	if err != nil {
		panic(fmt.Errorf("❌ failed to submit transaction: %w", err))
	}

	// Since no result is expected, just confirm success
	fmt.Printf("*** ✅  Transaction committed successfully. Result: %s\n", string(submitResult))
	return getAllFileMetadata(contract)
}

func formatJSON(data []byte) string {
	var prettyJSON bytes.Buffer
	if err := json.Indent(&prettyJSON, data, "", "  "); err != nil {
		panic(fmt.Errorf("failed to parse JSON: %w", err))
	}
	return prettyJSON.String()
}
