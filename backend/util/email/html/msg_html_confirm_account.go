package html

import (
	"bytes"
	"html/template"
	"log"
)

func HtmlMessage(data HtlmlMsg) string {
	tmpl, err := template.New("email").Parse(`
    <html>
		<head>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					padding: 20px;
				}
				.container {
					background-color: #ffffff;
					padding: 30px;
					border-radius: 8px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				h1 {
					color: #2c3e50;
				}
				p {
					font-size: 16px;
					color: #34495e;
				}
				.code {
					font-size: 18px;
					color: #e74c3c;
					font-weight: bold;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>Bonjour {{.Name}},</h1>
				<p>Votre compte a été <strong>créé avec succès</strong>, mais il n’est pas encore actif.</p>
				<p>Veuillez utiliser le code de sécurité sociale ci-dessous pour activer votre compte :</p>
				<p class="code">Code : {{.Code}}</p>
				<p>Merci de votre confiance.<br>L'équipe support</p>
			</div>
		</body>
	</html>
`)
	if err != nil {
		log.Fatalf("Erreur lors de la création du template : %v", err)
	}

	var body bytes.Buffer
	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Panicf("Erreur lors de l'exécution du template : %v", err)
	}
	return body.String()
}

func HtmlMessageConfirmAccount(data HtlmlMsg) string {
	tmpl, err := template.New("email").Parse(`
    <html>
		<head>
			<style>
				h1 { color: blue; }
				p { font-size: 14px; font-weight: bold; }
			</style>
		</head>
		<body>
			<h1>Hey Sir {{.Name}}</h1>
			<p>Your Confiramtion code is  :</p>
			<p>Code: {{.Code}}</p>
		</body>
	</html>
`)
	if err != nil {
		log.Fatalf("Error creating template: %v", err)
	}

	// Render the template to a buffer
	var body bytes.Buffer
	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Panicf("Error rendering template: %v", err)
	}
	return body.String()
}
