package main

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"sss
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"log"
	"math/big"
	mathrand "math/rand"
	"net/http"
	"net/smtp"
	"os"
	"regexp"
	"strings"
	"time"
)

type SuccessResponse struct {
	Message string        `json:"message"`
	Data    LoginResponse `json:"data"`
}

type LoginResponse struct {
	Token    string      `json:"token"`
	UserData interface{} `json:"userdata"`
}

type AddPKRequest struct {
	PK string `json:"pk" binding:"required"`
}

func sanitizeFilename(email string) string {
	reg := regexp.MustCompile(`[^a-zA-Z0-9]+`)
	return reg.ReplaceAllString(email, "_")
}

func generateOTP() string {
	mathrand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", mathrand.Intn(1000000))
}

type deterministicReaderFromEmail struct {
	r *mathrand.Rand
}

func (d *deterministicReaderFromEmail) Read(p []byte) (n int, err error) {
	for i := range p {
		p[i] = byte(d.r.Intn(256))
	}
	return len(p), nil
}

func newDeterministicReader(email, otp string) *deterministicReaderFromEmail {
	combined := email + otp
	hash := sha256.Sum256([]byte(combined))
	seed := new(big.Int).SetBytes(hash[:]).Int64()
	src := mathrand.NewSource(seed)
	return &deterministicReaderFromEmail{r: mathrand.New(src)}
}

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Entrez votre email : ")
	email, _ := reader.ReadString('\n')
	email = strings.TrimSpace(email)

	fmt.Print("Entrez votre mot de passe : ")
	password, _ := reader.ReadString('\n')
	password = strings.TrimSpace(password)

	loginPayload := map[string]string{
		"email":    email,
		"password": password,
	}
	payloadBytes, _ := json.Marshal(loginPayload)

	resp, err := http.Post("http://192.168.71.208:3000/login", "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.Fatalf("❌ Échec de l'authentification : %v", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	fmt.Println("🔍 Réponse brute login:", string(bodyBytes))

	resp.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	var successRes SuccessResponse
	if err := json.NewDecoder(resp.Body).Decode(&successRes); err != nil {
		log.Fatalf("❌ Erreur décodage réponse login : %v", err)
	}

	if successRes.Data.Token == "" {
		log.Fatalf("❌ Aucun token JWT trouvé dans la réponse ! Vérifiez le champ JSON.")
	}

	token := successRes.Data.Token
	fmt.Println("✅ Authentification réussie. Token reçu :")

	otp := generateOTP()
	smtpUser := "zebdaadam1996@gmail.com"
	smtpPass := "lnlutoymrdtpsyms"
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	to := []string{email}
	message := []byte("Subject: Vérification OTP\r\n" +
		"\r\n" +
		"Votre code OTP est : " + otp + "\r\n" +
		"Valide pendant 2 minutes.\r\n")

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	if err := smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpUser, to, message); err != nil {
		log.Fatalf("❌ Échec envoi OTP : %v", err)
	}
	fmt.Println("📧 OTP envoyé avec succès.")

	fmt.Print("⏳ Entrez l'OTP (valide 2 minutes) : ")
	inputChan := make(chan string)
	go func() {
		input, _ := reader.ReadString('\n')
		inputChan <- strings.TrimSpace(input)
	}()

	select {
	case userOTP := <-inputChan:
		if userOTP != otp {
			log.Fatal("❌ OTP incorrect.")
		}
		fmt.Println("✅ OTP vérifié. Génération des clés...")

	case <-time.After(2 * time.Minute):
		log.Fatal("⏰ Temps écoulé. OTP expiré.")
	}

	// Generate RSA key pair using crypto/rand
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}
	safeEmail := sanitizeFilename(email)

	privFileName := fmt.Sprintf("private_%s.pem", safeEmail)
	privFile, _ := os.Create(privFileName)
	defer privFile.Close()
	privBytes := x509.MarshalPKCS1PrivateKey(privateKey)
	pem.Encode(privFile, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: privBytes})

	pubFileName := fmt.Sprintf("public_%s.pem", safeEmail)
	pubFile, _ := os.Create(pubFileName)
	defer pubFile.Close()
	pubBytes, _ := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	pem.Encode(pubFile, &pem.Block{Type: "PUBLIC KEY", Bytes: pubBytes})

	fmt.Println("🔐 Clés RSA générées et sauvegardées.")

	pubData, err := os.ReadFile(pubFileName)
	if err != nil {
		log.Fatalf("❌ Impossible de lire le fichier public : %v", err)
	}

	addPKReq := AddPKRequest{
		PK: string(pubData),
	}
	jsonData, err := json.Marshal(addPKReq)
	if err != nil {
		log.Fatalf("❌ Échec de la sérialisation JSON : %v", err)
	}

	req, err := http.NewRequest("POST", "http://192.168.71.208:3000/user/add-pk", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatalf("❌ Erreur création requête : %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp2, err := client.Do(req)
	if err != nil {
		log.Fatalf("❌ Erreur appel à /user/add-pk : %v", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp2.Body)
		log.Fatalf("❌ Erreur backend (%d) : %s", resp2.StatusCode, string(body))
	}

	fmt.Println("✅ Clé publique envoyée avec succès au serveur.")
}
