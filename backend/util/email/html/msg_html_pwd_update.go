package html

import (
	"bytes"
	"html/template"
	"log"
	"scps-backend/feature"
)

func HtmlMessageRestPwd(data *feature.User) string {

	tmpl, err := template.New("email").Parse(`
    <html>
		<head>
			<style>
				h1 { color: blue; }
				p { font-size: 14px; font-weight: bold; }
			</style>
		</head>
		<body>
			<h1>Hey sir  {{.Name }} </h1>
			<p>Your password is updated successfully</p>
			<br>
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
