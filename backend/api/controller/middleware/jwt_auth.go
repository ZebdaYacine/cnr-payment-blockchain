package middleware

import (
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	util "scps-backend/util/token"
	"strings"

	"github.com/gin-gonic/gin"
)

func accessDenied(c *gin.Context, err string) {
	log.Println(err)
	c.JSON(http.StatusUnauthorized, model.ErrorResponse{Message: err})
	c.Abort()
}

func JwtAuthMiddleware(secret string, action string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		t := strings.Split(authHeader, " ")
		if len(t) == 2 {
			authToken := t[1]
			authorized, _ := util.IsAuthorized(authToken, secret)
			if !authorized {
				c.JSON(http.StatusUnauthorized, "unauthorized access")
				c.Abort()
				return
			}
			_, err := util.ExtractFieldFromToken(authToken, secret, "id")
			userAction, err1 := util.ExtractFieldFromToken(authToken, secret, "action")
			if err != nil {
				c.JSON(http.StatusUnauthorized, model.ErrorResponse{Message: err.Error()})
				c.Abort()
				return
			}
			if err1 != nil {
				c.JSON(http.StatusUnauthorized, model.ErrorResponse{Message: err1.Error()})
				c.Abort()
				return
			}
			if action != userAction {
				c.JSON(http.StatusUnauthorized, model.ErrorResponse{Message: "Not authorized"})
				c.Abort()
				return
			}
			if userAction == action {
				c.Next()
				return
			}
			accessDenied(c, "You are not allowed to access this")
		}
		c.JSON(http.StatusUnauthorized, model.ErrorResponse{Message: "No Token found"})
		c.Abort()
	}
}
