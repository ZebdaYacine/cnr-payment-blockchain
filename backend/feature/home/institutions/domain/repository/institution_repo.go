package repository

import (
	"context"
	"fmt"
	"log"
	"scps-backend/feature"
	profileRepo "scps-backend/feature/home/profile/domain/repository"
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
	collection := s.database.Collection(database.USER.String())
	profileRepo := profileRepo.NewProfileRepository(s.database)
	phase, err := profileRepo.GetCurrentPhase(c)
	if err != nil {
		return nil, fmt.Errorf("error getting current phase: %v", err)
	}
	phseId := phase.ID
	objID, err := primitive.ObjectIDFromHex(userid)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format")
	}

	// Find the user by ID
	var user feature.User
	err = collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return nil, fmt.Errorf("user not found")
	}

	filter := bson.M{}

	switch user.WorkAt {
	case "DIO":
		if user.Type == "IT" {
			filter = bson.M{"$or": []bson.M{
				{"workAt": "POST", "type": "RESP-SFTP"},
				{"workAt": "DOF", "type": "FINC"},
				{"workAt": "CCR", "type": bson.M{"$in": []string{"CAL", "IT"}}},
				{"workAt": "DIO", "type": bson.M{"$in": []string{"CAL", "VAL", "IT"}}},
			},
				"phases.id": phseId,
			}
		} else if user.Type == "CAL" || user.Type == "VAL" {
			filter = bson.M{"$or": []bson.M{
				{"workAt": "CCR", "type": "CAL"},
				{"workAt": "DIO", "type": bson.M{"$in": []string{"IT", "CAL", "VAL"}},
					"phases.id": phseId},
			}}
		}

	case "CCR":
		if user.Type == "CAL" {
			filter = bson.M{"$or": []bson.M{
				{"workAt": "CCR", "type": "CAL"},
				{"workAt": "DIO", "type": bson.M{"$in": []string{"CAL", "VAL", "IT"}}},
				{"workAt": "CCR", "type": "IT"},
			}, "phases.id": phseId,
			}
		} else if user.Type == "IT" {
			agencyFilter := bson.M{"parent.id": user.IdInstituion}
			agencyCursor, err := s.database.Collection(database.AGENCE.String()).Find(c, agencyFilter)
			if err != nil {
				return nil, fmt.Errorf("❌ Error fetching agencies: %v", err)
			}
			defer agencyCursor.Close(c)

			var agencyIDs []string
			for agencyCursor.Next(c) {
				var agency struct {
					ID string `bson:"id"`
				}
				if err := agencyCursor.Decode(&agency); err == nil {
					agencyIDs = append(agencyIDs, agency.ID)
				}
			}

			filter = bson.M{"$or": []bson.M{
				{"idInstituion": bson.M{"$in": agencyIDs}}, // Match users in these agencies
				{"workAt": "DIO", "type": "IT"},            // Also allow DIO IT users
			}, "phases.id": phseId,
			}
		}
	case "AGENCE":
		var agency struct {
			Parent struct {
				ID string `bson:"id"`
			} `bson:"parent"`
		}
		err = s.database.Collection(database.AGENCE.String()).FindOne(c, bson.M{"id": user.IdInstituion}).Decode(&agency)
		if err != nil {
			return nil, fmt.Errorf("❌ Error fetching agency's parent CCR: %v", err)
		}

		filter = bson.M{"idInstituion": agency.Parent.ID, "workAt": "CCR", "type": "IT"}
	case "POST":
		if user.Type == "RESP-SFTP" {
			filter = bson.M{"$or": []bson.M{
				{"workAt": "DIO", "type": "IT"},
				{"workAt": "POST", "type": "CAL"},
			}, "phases.id": phseId,
			}
		} else if user.Type == "CAL" {
			filter = bson.M{"workAt": "POST", "type": "RESP-SFTP", "phases.id": phseId}
		}

	case "DOF":
		if user.Type == "FINC" {
			filter = bson.M{"workAt": "DIO", "type": "IT", "phases.id": phseId}
		}
	}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var users []*feature.User
	for cursor.Next(context.TODO()) {
		var u feature.User
		if err := cursor.Decode(&u); err != nil {
			continue
		}
		if u.ID.Hex() != userid {
			u.Id = u.ID.Hex()
			users = append(users, &u)
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

// func (s *institutionsRepository) BringUsers(c context.Context, userid string) ([]*feature.User, error) {
// 	collection := s.database.Collection(database.USER.String())
// 	// Convert string ID to MongoDB ObjectID
// 	objID, err := primitive.ObjectIDFromHex(userid)
// 	if err != nil {
// 		return nil, fmt.Errorf("invalid user ID format")
// 	}

// 	// Find the user by ID
// 	var user feature.User
// 	err = collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
// 	if err != nil {
// 		return nil, fmt.Errorf("user not found")
// 	}
// 	filter := bson.M{}

// 	switch user.WorkAt {
// 	case "DIO":
// 		if user.Type == "IT" {
// 			filter = bson.M{"$or": []bson.M{
// 				{"workAt": "POST", "type": "RESP-SFTP"},
// 				{"workAt": "DOF", "type": "FINC"},
// 				{"workAt": "CCR", "type": bson.M{"$in": []string{"CAL", "IT"}}},
// 				{"workAt": "DIO", "type": bson.M{"$in": []string{"CAL", "VAL", "IT"}}},
// 			}}
// 		} else if user.Type == "CAL" || user.Type == "VAL" {
// 			filter = bson.M{"$or": []bson.M{
// 				{"workAt": "CCR", "type": "CAL"},
// 				{"workAt": "DIO", "type": bson.M{"$in": []string{"IT", "CAL", "VAL"}}},
// 			}}
// 		}

// 	case "CCR":
// 		if user.Type == "CAL" {
// 			filter = bson.M{"$or": []bson.M{
// 				{"workAt": "CCR", "type": "CAL"},
// 				{"workAt": "DIO", "type": bson.M{"$in": []string{"CAL", "VAL", "IT"}}},
// 				{"workAt": "CCR", "type": "IT"},
// 			}}
// 		} else if user.Type == "IT" {
// 			agencyFilter := bson.M{"parent.id": user.IdInstituion}
// 			agencyCursor, err := s.database.Collection(database.AGENCE.String()).Find(c, agencyFilter)
// 			if err != nil {
// 				return nil, fmt.Errorf("❌ Error fetching agencies: %v", err)
// 			}
// 			defer agencyCursor.Close(c)

// 			var agencyIDs []string
// 			for agencyCursor.Next(c) {
// 				var agency struct {
// 					ID string `bson:"id"`
// 				}
// 				if err := agencyCursor.Decode(&agency); err == nil {
// 					agencyIDs = append(agencyIDs, agency.ID)
// 				}
// 			}

// 			filter = bson.M{"$or": []bson.M{
// 				{"idInstituion": bson.M{"$in": agencyIDs}}, // Match users in these agencies
// 				{"workAt": "DIO", "type": "IT"},            // Also allow DIO IT users
// 			}}
// 		}
// 	case "AGENCE":
// 		var agency struct {
// 			Parent struct {
// 				ID string `bson:"id"`
// 			} `bson:"parent"`
// 		}
// 		err = s.database.Collection(database.AGENCE.String()).FindOne(c, bson.M{"id": user.IdInstituion}).Decode(&agency)
// 		if err != nil {
// 			return nil, fmt.Errorf("❌ Error fetching agency's parent CCR: %v", err)
// 		}

// 		filter = bson.M{"idInstituion": agency.Parent.ID, "workAt": "CCR", "type": "IT"}
// 	case "POST":
// 		if user.Type == "RESP-SFTP" {
// 			filter = bson.M{"$or": []bson.M{
// 				{"workAt": "DIO", "type": "IT"},
// 				{"workAt": "POST", "type": "CAL"},
// 			}}
// 		} else if user.Type == "CAL" {
// 			filter = bson.M{"workAt": "POST", "type": "RESP-SFTP"}
// 		}

// 	case "DOF":
// 		if user.Type == "FINC" {
// 			filter = bson.M{"workAt": "DIO", "type": "IT"}
// 		}
// 	}
// 	cursor, err := collection.Find(context.TODO(), filter)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer cursor.Close(context.TODO())

// 	var users []*feature.User
// 	for cursor.Next(context.TODO()) {
// 		var u feature.User
// 		if err := cursor.Decode(&u); err != nil {
// 			// Remove debug log
// 			// log.Println("Error decoding user:", err)
// 			continue
// 		}
// 		if u.ID.Hex() != userid {
// 			u.Id = u.ID.Hex()
// 			users = append(users, &u)
// 		}
// 	}

// 	if err := cursor.Err(); err != nil {
// 		return nil, err
// 	}

// 	return users, nil
// }

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
