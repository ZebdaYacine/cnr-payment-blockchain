package fabric

import (
	"crypto/x509"
	"fmt"
	"os"
	"scps-backend/pkg"
	"time"

	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/hash"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

func SdkProvider(function string, args ...interface{}) (interface{}, error) {
	var SETTING = pkg.GET_BLOCKCHAIN_SETTIN()
	chainCode := SETTING.CHAIN_CODE
	channelName := SETTING.CHANNEL_NAME
	// The gRPC client connection should be shared by all Gateway connections to this endpoint
	clientConnection := newGrpcConnection()
	defer clientConnection.Close()
	id := newIdentity()
	sign := newSign()
	// Create a Gateway connection for a specific client identity
	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithHash(hash.SHA256),
		client.WithClientConnection(clientConnection),
		// Default timeouts for different gRPC calls
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		panic(err)
	}
	defer gw.Close()
	network := gw.GetNetwork(channelName)
	contract := network.GetContract(chainCode)
	// initLedger(contract)
	switch function {
	case "getAll":
		return getAllFileMetadata(contract)
	case "getAllByFolderName":
		if folder, ok := args[0].(*FolderMetadata); ok {
			return getAllFileMetadataByFolderName(contract, folder.Name)
		}
		return nil, fmt.Errorf("invalid argument type for getAllByFolderName")
	case "add-file":
		if file, ok := args[0].(*FileMetadata); ok {
			return createFileMetadata(contract, file)
		}
		return nil, fmt.Errorf("invalid argument type for add-file")
	case "add-folder":
		if folder, ok := args[0].(*FolderMetadata); ok {
			return createFolderMetadata(contract, folder)
		}
		return nil, fmt.Errorf("invalid argument type for add-folder")
	case "get-folder":
		if folder, ok := args[0].(*FolderMetadata); ok {
			return getAllFolderMetadataByDestination(contract, folder.Destination)
		}
		return nil, fmt.Errorf("invalid argument type for add-folder")
	case "deleteAll":
		return nil, deleteAllFileMetadata(contract)
	default:
		return nil, fmt.Errorf("unknown function: %s", function)
	}
}

// newGrpcConnection creates a gRPC connection to the Gateway server.
func newGrpcConnection() *grpc.ClientConn {
	certificatePEM, err := os.ReadFile(tlsCertPath)
	if err != nil {
		panic(fmt.Errorf("failed to read TLS certifcate file: %w", err))
	}

	certificate, err := identity.CertificateFromPEM(certificatePEM)
	if err != nil {
		panic(err)
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(certificate)
	transportCredentials := credentials.NewClientTLSFromCert(certPool, gatewayPeer)

	connection, err := grpc.NewClient(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		panic(fmt.Errorf("failed to create gRPC connection: %w", err))
	}

	return connection
}
