package repository

import (
	"context"
	"log"
	"scps-backend/feature"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type institutionsRepository struct {
	database database.Database
}

type InstitutionsRepository interface {
	GetPeers(c context.Context, nameOrg, idOrg string, userid string) (*feature.Elements, error)
	BringUsers(c context.Context, userid string) ([]*feature.User, error)
}

func NewInstitutionsRepository(db database.Database) InstitutionsRepository {
	return &institutionsRepository{database: db}
}

func (s *institutionsRepository) getInstitutionnameByUserID(c context.Context, userID string) (string, error) {
	collection := s.database.Collection(database.USER.String())
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		log.Print("Invalid user ID format:", err)
		return "", err
	}
	filter := bson.D{{Key: "_id", Value: objID}}
	var result struct {
		WorkAt string `bson:"workAt"`
	}
	err = collection.FindOne(c, filter).Decode(&result)
	if err != nil {
		return "", err
	}
	return result.WorkAt, nil
}

func (s *institutionsRepository) BringUsers(c context.Context, userid string) ([]*feature.User, error) {
	var children []bson.M
	objID, err := primitive.ObjectIDFromHex(userid)
	if err != nil {
		log.Print("Invalid user ID:", err)
		return nil, err
	}
	institution, err := s.getInstitutionnameByUserID(c, userid)
	if err != nil {
		log.Print("Error fetching institutions name fialed:", err)
		return nil, err
	}
	filter := bson.M{
		"_id":    bson.M{"$ne": objID},
		"type":   bson.M{"$in": []string{"VAL", "CAL", "RESP-SFTP"}},
		"workAt": bson.M{"$ne": "POST"},
	}
	if institution == "POST" {
		filter["workAt"] = bson.M{"$in": []string{"POST"}}
	}
	collection := s.database.Collection(database.USER.String())
	users := []*feature.User{}
	cursor, err := collection.Find(c, filter)
	if err != nil {
		log.Print("Error fetching child institutions:", err)
		return nil, err
	}
	defer cursor.Close(c)
	if err := cursor.All(c, &children); err != nil {
		log.Print("Error decoding child institutions:", err)
		return nil, err
	}
	for _, child := range children {
		log.Println(child)
		user := feature.User{
			Id:           child["_id"].(primitive.ObjectID).Hex(),
			UserName:     child["username"].(string),
			WorkAt:       child["workAt"].(string),
			IdInstituion: child["idInstituion"].(string),
			Type:         child["type"].(string),
			Wilaya:       child["wilaya"].(string),
		}
		users = append(users, &user)
	}
	return users, nil
}

func (s *institutionsRepository) GetUsers(c context.Context, userid string, elems *feature.Elements) {
	users, err := s.BringUsers(c, userid)
	if err != nil {
		log.Print("Error fetching Users :", err)
	}
	for _, user := range users {
		elems.Child = append(elems.Child, feature.Peer{
			Obj:  user,
			Type: user.Type,
		})
	}
}

func (s *institutionsRepository) GetPeers(c context.Context, nameInstitutions, idInstitutions string, userid string) (*feature.Elements, error) {
	col := nameInstitutions
	if nameInstitutions == "POST" || nameInstitutions == "DOF" || nameInstitutions == "DIO" {
		col = database.INSTITUTIONS.String()
	}
	switch nameInstitutions {
	case "AGENCE":
		{
			col = database.AGENCE.String()
		}
	case "CCR":
		{
			col = database.CCR.String()
		}
	}
	id, err := primitive.ObjectIDFromHex(idInstitutions)
	if err != nil {
		log.Print("Invalid ID format:", err)
		return nil, err
	}
	collection := s.database.Collection(col)
	var result bson.M
	if err := collection.FindOne(c, bson.D{{Key: "_id", Value: id}}).Decode(&result); err != nil {
		log.Print("Error fetching institution:", err)
		return nil, err
	}
	elems := &feature.Elements{}
	switch nameInstitutions {
	case "POST":
		{
			elems.Institutiont.Obj = parse(result)
			elems.Institutiont.Type = "POST"
			elems.Child = nil
		}
	case "DOF":
		{
			elems.Institutiont.Obj = parse(result)
			elems.Institutiont.Type = "DOF"
			elems.Child = nil
		}
	case "DIO":
		{
			elems.Institutiont.Obj = parseDIO(result)
			elems.Institutiont.Type = "DIO"
			collection := s.database.Collection(col)

			var children []bson.M
			cursor, _ := collection.Find(c, bson.M{"parent.id": id.Hex()})
			if err = cursor.All(c, &children); err != nil {
				log.Print("Error decoding child institutions:", err)
				return nil, err
			}
			for _, child := range children {
				elems.Child = append(elems.Child, feature.Peer{
					Obj:  parse(child),
					Type: result["name"].(string),
				})
			}
			collection = s.database.Collection(database.CCR.String())
			cursor, err = collection.Find(c, bson.M{"parent.id": id.Hex()})
			if err != nil {
				log.Print("Error fetching child institutions:", err)
				return nil, err
			}
			if err := cursor.All(c, &children); err != nil {
				log.Print("Error decoding child institutions:", err)
				return nil, err
			}
			for _, child := range children {
				elems.Child = append(elems.Child, feature.Peer{
					Obj:  parseCCR(child),
					Type: "CCR",
				})
			}
			// s.GetUsers(c, userid, elems)
		}
	case "CCR":
		{
			elems.Institutiont.Obj = parseCCR(result)
			elems.Institutiont.Type = "CCR"
			children, err := s.getChildren(c, database.AGENCE.String(), "parent.id", id, result)
			if err != nil {
				log.Print("Error fetching child institutions:", err)
				return nil, err
			}
			for _, child := range children {
				elems.Child = append(elems.Child, feature.Peer{
					Obj:  parseAgence(child),
					Type: "CCR",
				})
			}
			// s.GetUsers(c, userid, elems)
		}

	case "AGENCE":
		{
			elems.Institutiont.Obj = parseAgence(result)
			elems.Institutiont.Type = "AGENCE"
			elems.Child = nil
		}
	}

	return elems, nil
}

func parse(result bson.M) feature.Instiutiont {
	var id string
	if objID, ok := result["_id"].(primitive.ObjectID); ok {
		id = objID.Hex()
	}
	name, _ := result["name"].(string)
	var parent *feature.Instiutiont
	if parentData, ok := result["parent"].(bson.M); ok {
		parentID, _ := parentData["id"].(string)
		parentName, _ := parentData["name"].(string)

		parent = &feature.Instiutiont{
			ID:   parentID,
			Name: parentName,
		}
	}
	return feature.Instiutiont{
		ID:     id,
		Name:   name,
		Parent: parent,
	}
}

func parseDIO(result bson.M) feature.Instiutiont {
	return feature.Instiutiont{
		ID:     result["_id"].(primitive.ObjectID).Hex(),
		Name:   result["name"].(string),
		Parent: nil,
	}
}

func parseAgence(result bson.M) feature.Agence {
	var id string
	if objID, ok := result["_id"].(primitive.ObjectID); ok {
		id = objID.Hex()
	}

	name, _ := result["name"].(string)
	code, _ := result["code"].(string)

	var ccr *feature.CCR
	if ccrData, ok := result["parent"].(bson.M); ok {
		ccrID, _ := ccrData["id"].(string)
		ccrName, _ := ccrData["name"].(string)
		ccr = &feature.CCR{
			ID:     ccrID,
			Name:   ccrName,
			Parent: nil,
		}
	}
	return feature.Agence{
		ID:   id,
		Name: name,
		Code: code,
		CCR:  ccr,
	}
}

func parseCCR(result bson.M) feature.CCR {
	var id string
	if objID, ok := result["_id"].(primitive.ObjectID); ok {
		id = objID.Hex()
	}
	name, _ := result["name"].(string)
	code, _ := result["code"].(string)

	var DIO *feature.Instiutiont
	if parentData, ok := result["parent"].(bson.M); ok {
		parentID, _ := parentData["id"].(string)
		parentName, _ := parentData["name"].(string)
		DIO = &feature.Instiutiont{
			ID:     parentID,
			Name:   parentName,
			Parent: nil,
		}
	}
	return feature.CCR{
		ID:     id,
		Name:   name,
		Code:   code,
		Parent: DIO,
	}
}

func (s *institutionsRepository) getChildren(c context.Context, collectionName, parentField string, id primitive.ObjectID, parentResult bson.M) ([]bson.M, error) {
	collection := s.database.Collection(collectionName)
	cursor, err := collection.Find(c, bson.M{parentField: id.Hex()})
	if err != nil {
		log.Print("Error fetching child institutions:", err)
		return nil, err
	}

	var children []bson.M
	if err := cursor.All(c, &children); err != nil {
		log.Print("Error decoding child institutions:", err)
		return nil, err
	}

	return children, nil
}
