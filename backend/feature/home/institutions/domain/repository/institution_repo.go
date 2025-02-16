package repository

import (
	"context"
	"errors"
	"scps-backend/feature"
	"scps-backend/pkg/database"
)

type institutionsRepository struct {
	database database.Database
}

type InstitutionsRepository interface {
	GetInstitutions(c context.Context) (*[]feature.Instiutiont, error)
	GetChildOfInstitutions(c context.Context, idInstitutions string) (*[]feature.Child, error)
}

func NewInstitutionsRepository(db database.Database) InstitutionsRepository {
	return &institutionsRepository{
		database: db,
	}
}

func (s *institutionsRepository) GetInstitutions(c context.Context) (*[]feature.Instiutiont, error) {
	institutions := []feature.Instiutiont{
		{ID: "1", Name: "POST"},
		{ID: "2", Name: "DG"},
		{ID: "3", Name: "CCR"},
		{ID: "4", Name: "AGENCE"},
	}

	return &institutions, nil
}

func (s *institutionsRepository) GetChildOfInstitutions(c context.Context, idInstitutions string) (*[]feature.Child, error) {

	institutions := []feature.Instiutiont{
		{ID: "1", Name: "POST"},
		{ID: "2", Name: "DG"},
		{ID: "3", Name: "CCR"},
		{ID: "4", Name: "AGENCE"},
	}

	children := []feature.Child{
		{ID: "101", Name: "TIPZA", Parent: &institutions[1]},
		{ID: "102", Name: "AIN DEFLA", Parent: &institutions[1]},
		{ID: "103", Name: "LAGHOUAT", Parent: &institutions[2]},
		{ID: "104", Name: "BLIDA", Parent: &institutions[2]},
		{ID: "105", Name: "GHARDAIA", Parent: &institutions[2]},
		{ID: "101", Name: "BEJAIA", Parent: &institutions[2]},
		{ID: "102", Name: "DJELFA", Parent: &institutions[1]},
		{ID: "103", Name: "TEBESSA", Parent: &institutions[2]},
		{ID: "104", Name: "MEDIA", Parent: &institutions[1]},
		{ID: "105", Name: "ORAN", Parent: &institutions[2]},
	}
	var filteredChildren []feature.Child
	for _, child := range children {
		if child.Parent != nil && child.Parent.ID == idInstitutions {
			filteredChildren = append(filteredChildren, child)
		}
	}

	if len(filteredChildren) == 0 {
		return nil, errors.New("no children found for the given institution ID")
	}

	return &filteredChildren, nil
}
