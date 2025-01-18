package core

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"scps-backend/api/controller/model"
	"scps-backend/feature"
	"scps-backend/pkg"
	"scps-backend/pkg/database"
	util "scps-backend/util/token"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var RootServer = pkg.GET_ROOT_SERVER_SEETING()

func IsDataRequestSupported[T feature.Account](data *T, c *gin.Context) bool {
	err := c.ShouldBindJSON(data)
	log.Println(err)
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{Message: "Data sent not supported the api format "})
		return false
	}
	return true
}

func GetIdUser(c *gin.Context) string {
	authHeader := c.Request.Header.Get("Authorization")
	token := strings.Split(authHeader, " ")
	log.Println(token[1])
	id, err := util.ExtractFieldFromToken(token[1], RootServer.SECRET_KEY, "id")
	if err != nil {
		fmt.Println(err)
		log.Printf("Failed to extract id from token: %v", err)
		return ""
	}
	return id.(string)
}

func ConvertBsonToStruct[T feature.Account](bsonData primitive.M) (*T, error) {
	var model *T
	bsonBytes, err := bson.Marshal(bsonData)
	if err != nil {
		log.Panic("Error marshalling bson.M:", err)
		return nil, err
	}
	err = bson.Unmarshal(bsonBytes, &model)
	if err != nil {
		log.Panic("Error unmarshalling to struct:", err)
		return nil, err
	}
	return model, err
}

func UpdateDoc[T feature.Account](c context.Context, collection database.Collection, update primitive.M, filterUpdate primitive.D) (*T, error) {
	_, err := collection.UpdateOne(c, filterUpdate, update)
	if err != nil {
		log.Panic(err)
		return nil, err
	}
	var updatedDocument bson.M
	err = collection.FindOne(c, filterUpdate).Decode(&updatedDocument)
	if err != nil {
		log.Panic("Error finding updated document:", err)
		return nil, err
	}
	fmt.Print("Document is updated successfuly")
	updatedObject, err := ConvertBsonToStruct[T](updatedDocument)
	if err != nil {
		log.Printf("Failed to convert bson to struct: %v", err)
		return nil, err
	}
	return updatedObject, nil
}
