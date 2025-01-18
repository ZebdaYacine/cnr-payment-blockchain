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
				h1 { color: blue; }
				p { font-size: 14px; font-weight: bold; }
			</style>
		</head>
		<body>
			<h1>Hey Sir {{.Name}}</h1>
			<p>Votre Compte est creer avec success votre code securite social est :</p>
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
