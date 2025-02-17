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
	// GetInstitutions(c context.Context) (*[]feature.Instiutiont, error)
	GetPeers(c context.Context, nameInstitutions, idInstitutions string) (*feature.Elements, error)
}

func NewInstitutionsRepository(db database.Database) InstitutionsRepository {
	return &institutionsRepository{database: db}
}

func (s *institutionsRepository) GetInstitutions(c context.Context) (*[]feature.Instiutiont, error) {
	return &[]feature.Instiutiont{
		{ID: "1", Name: "POST"},
		{ID: "2", Name: "DG"},
		{ID: "3", Name: "CCR"},
		{ID: "4", Name: "AGENCE"},
	}, nil
}

func (s *institutionsRepository) GetPeers(c context.Context, nameInstitutions, idInstitutions string) (*feature.Elements, error) {
	col := nameInstitutions
	if nameInstitutions == "POST" || nameInstitutions == "DG" {
		col = "INSTITUTUION"
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
			elems.Institutiont.Obj = parsePost(result)
			elems.Institutiont.Type = "POST"
			elems.Child = nil
		}
	case "DG":
		{
			elems.Institutiont.Obj = parseDG(result)
			elems.Institutiont.Type = "DG"
			collection := s.database.Collection(col)
			var result bson.M
			if err := collection.FindOne(c, bson.M{"parent.id": id.Hex()}).Decode(&result); err != nil {
				log.Print("Error fetching institution:", err)
				return nil, err
			}

			elems.Child = append(elems.Child, feature.Peer{
				Obj:  parsePost(result),
				Type: "POST",
			})
			collection = s.database.Collection("CCR")

			cursor, err := collection.Find(c, bson.M{"parent.id": id.Hex()})
			if err != nil {
				log.Print("Error fetching child institutions:", err)
				return nil, err
			}
			var children []bson.M
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
		}
	case "CCR":
		{
			elems.Institutiont.Obj = parseCCR(result)
			elems.Institutiont.Type = "CCR"
			children, err := s.getChildren(c, "AGENCE", "ccr.id", id, result)
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
		}

	case "AGENCE":
		{
			elems.Institutiont.Obj = parseAgence(result)
			elems.Institutiont.Obj = "AGENCE"
			elems.Child = nil
		}
	}

	return elems, nil
}

func parsePost(result bson.M) feature.Instiutiont {
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

func parseDG(result bson.M) feature.Instiutiont {
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
	if ccrData, ok := result["ccr"].(bson.M); ok {
		ccrID, _ := ccrData["id"].(string)
		ccrName, _ := ccrData["name"].(string)
		ccrCode, _ := ccrData["code"].(string)
		ccr = &feature.CCR{
			ID:     ccrID,
			Name:   ccrName,
			Code:   ccrCode,
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

	var dg *feature.Instiutiont
	if parentData, ok := result["parent"].(bson.M); ok {
		parentID, _ := parentData["id"].(string)
		parentName, _ := parentData["name"].(string)
		log.Println(parentName)
		dg = &feature.Instiutiont{
			ID:     parentID,
			Name:   parentName,
			Parent: nil,
		}
	}
	return feature.CCR{
		ID:     id,
		Name:   name,
		Code:   code,
		Parent: dg,
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
