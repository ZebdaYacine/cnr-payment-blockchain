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
	GetInstitutions(c context.Context) (*[]feature.Instiutiont, error)
	GetChildOfInstitutions(c context.Context, nameInstitutions, idInstitutions string) (*feature.Elements, error)
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

func (s *institutionsRepository) GetChildOfInstitutions(c context.Context, nameInstitutions, idInstitutions string) (*feature.Elements, error) {
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
			if err := collection.FindOne(c, bson.M{"Parent.id": id.Hex()}).Decode(&result); err != nil {
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
			elems.Institutiont.Obj = "CCR"
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
	return feature.Instiutiont{
		ID:   result["_id"].(primitive.ObjectID).Hex(),
		Name: result["Name"].(string),
		Parent: &feature.Instiutiont{
			ID:   result["id"].(string),
			Name: result["Name"].(string),
		},
	}
}

func parseDG(result bson.M) feature.Instiutiont {
	return feature.Instiutiont{
		ID:     result["_id"].(primitive.ObjectID).Hex(),
		Name:   result["Name"].(string),
		Parent: nil,
	}
}

func parseAgence(result bson.M) feature.Agence {
	return feature.Agence{
		ID:   result["_id"].(primitive.ObjectID).Hex(),
		Name: result["name"].(string),
		Code: result["code"].(string),
		CCR: &feature.CCR{
			ID:     result["id"].(string),
			Name:   result["name"].(string),
			Code:   result["code"].(string),
			Parent: nil,
		},
	}
}

func parseCCR(result bson.M) feature.CCR {
	return feature.CCR{
		ID:     result["_id"].(primitive.ObjectID).Hex(),
		Name:   result["name"].(string),
		Code:   result["code"].(string),
		Parent: nil,
	}
}

func (s *institutionsRepository) getChildren(c context.Context, collectionName, parentField string, id primitive.ObjectID, parentResult bson.M) ([]bson.M, error) {
	collection := s.database.Collection(collectionName)
	cursor, err := collection.Find(c, bson.M{parentField: id})
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
