package repository

import (
	"context"
	"fmt"
	"time"

	"scps-backend/feature/dashboard/domain/entities"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Phase struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	Number      int                `bson:"number" json:"number"`
	StartAt     int                `bson:"startAt" json:"startAt"`
	EndAt       int                `bson:"endAt" json:"endAt"`
}

type dashboardRepository struct {
	database database.Database
}

type DashBoardRepository interface {
	GetUploadingFilesVersionStats(c context.Context) ([]entities.UploadStats, error)
	GetWorkersErrorRate(c context.Context) ([]entities.WorkerErrorRateResponse, error)
	GetHackingAttemptStats(c context.Context) ([]entities.HackingAttemptResponse, error)
}

func NewDashboardRepository(db database.Database) DashBoardRepository {
	return &dashboardRepository{database: db}
}

// --- Uploading Files & Versions ---

func (r *dashboardRepository) GetUploadingFilesVersionStats(ctx context.Context) ([]entities.UploadStats, error) {
	collection := r.database.Collection(database.FILE.String())

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	currentYear := time.Now().Year()

	groupMap := make(map[string]*entities.UploadStats)
	institutionMap := make(map[string]map[string]*entities.InstitutionDetail)

	for cursor.Next(ctx) {
		var doc struct {
			Time        string `bson:"time"`
			Version     string `bson:"version"`
			Institution string `bson:"organisation"`
			FileName    string `bson:"file_name"`
			Parent      string `bson:"parent"`
		}

		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		parsedTime, err := time.Parse(time.RFC3339, doc.Time)
		if err != nil || parsedTime.Year() != currentYear {
			continue
		}

		day := parsedTime.Format("02")
		month := parsedTime.Format("January")
		year := parsedTime.Format("2006")
		groupKey := day + "_" + month + "_" + year

		// Initialize group entry
		if _, exists := groupMap[groupKey]; !exists {
			groupMap[groupKey] = &entities.UploadStats{
				Day:          day,
				Month:        month,
				Year:         year,
				File:         0,
				Version:      0,
				Institutions: []entities.InstitutionDetail{},
			}
			institutionMap[groupKey] = make(map[string]*entities.InstitutionDetail)
		}

		group := groupMap[groupKey]

		// Initialize institution entry
		if _, exists := institutionMap[groupKey][doc.Institution]; !exists {
			institutionMap[groupKey][doc.Institution] = &entities.InstitutionDetail{
				Name:    doc.Institution,
				File:    0,
				Version: 0,
			}
		}
		inst := institutionMap[groupKey][doc.Institution]

		// Count base files and versions
		if doc.Parent == "" {
			group.File++
			inst.File++
		} else {
			group.Version++
			inst.Version++
		}
	}

	// Finalize institution lists
	var result []entities.UploadStats
	for key, group := range groupMap {
		for _, inst := range institutionMap[key] {
			group.Institutions = append(group.Institutions, *inst)
		}
		result = append(result, *group)
	}

	return result, nil
}

// --- Workers' Error Rate ---

func (r *dashboardRepository) GetWorkersErrorRate(ctx context.Context) ([]entities.WorkerErrorRateResponse, error) {
	collection := r.database.Collection(database.FILE.String())
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	countMap := map[string]*entities.WorkerErrorRateResponse{}

	for cursor.Next(ctx) {
		var doc struct {
			UserID  string `bson:"user_id"`
			IsValid bool   `bson:"is_valid"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		if _, exists := countMap[doc.UserID]; !exists {
			countMap[doc.UserID] = &entities.WorkerErrorRateResponse{
				UserID:       doc.UserID,
				InvalidFiles: 0,
				TotalFiles:   0,
			}
		}
		entry := countMap[doc.UserID]
		entry.TotalFiles++
		if !doc.IsValid {
			entry.InvalidFiles++
		}
	}

	var result []entities.WorkerErrorRateResponse
	for _, entry := range countMap {
		if entry.TotalFiles > 0 {
			entry.ErrorRate = float64(entry.InvalidFiles) / float64(entry.TotalFiles) * 100
		}
		result = append(result, *entry)
	}
	return result, nil
}

// --- Hacking Attempts ---
func (r *dashboardRepository) GetPhaseByID(ctx context.Context, id string) (*Phase, error) {
	collection := r.database.Collection(database.PHASE.String())
	currentDay := time.Now().Day()

	filter := bson.M{
		"startAt": bson.M{"$lte": currentDay},
		"endAt":   bson.M{"$gte": currentDay},
	}

	var phase Phase
	err := collection.FindOne(ctx, filter).Decode(&phase)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch current phase: %w", err)
	}
	if id == phase.ID.Hex() {
		return &phase, nil
	}
	return nil, nil
}
func (r *dashboardRepository) GetHackingAttemptStats(ctx context.Context) ([]entities.HackingAttemptResponse, error) {
	collection := r.database.Collection(database.FILE.String())

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to query documents: %w", err)
	}
	defer cursor.Close(ctx)

	phaseStats := make(map[string]*entities.HackingAttemptResponse)
	folderTracker := make(map[string]map[string]struct{})
	institutionTracker := make(map[string]map[string]struct{})

	for cursor.Next(ctx) {
		var doc struct {
			Phase       string `bson:"phase"`
			Version     string `bson:"version"`
			FileName    string `bson:"file_name"`
			Institution string `bson:"organisation"`
			Parent      string `bson:"parent"`
			Folder      string `bson:"folder"`
			Status      string `bson:"status"`
			Time        string `bson:"time"`
			LastVersion string `bson:"lastversion"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		// Resolve phase name by ID
		phaseName, _ := r.GetPhaseByID(ctx, doc.Phase)
		if phaseName == nil {
			continue
		}
		phase := *&phaseName.Name

		// Init phase stats if not exists
		if _, exists := phaseStats[phase]; !exists {
			phaseStats[phase] = &entities.HackingAttemptResponse{
				Phase:        phase,
				Version:      0,
				FilesNumber:  0,
				InvalidFiles: 0,
				Folder:       0,
				Institutions: []string{},
				Files:        []entities.HackingFileInfo{},
			}
			folderTracker[phase] = make(map[string]struct{})
			institutionTracker[phase] = make(map[string]struct{})
		}
		entry := phaseStats[phase]

		// Count folders
		if _, ok := folderTracker[phase][doc.Folder]; !ok && doc.Folder != "" {
			folderTracker[phase][doc.Folder] = struct{}{}
			entry.Folder = len(folderTracker[phase])
		}

		// Count institutions
		if _, ok := institutionTracker[phase][doc.Institution]; !ok && doc.Institution != "" {
			institutionTracker[phase][doc.Institution] = struct{}{}
			entry.Institutions = append(entry.Institutions, doc.Institution)
		}

		if doc.Status == "Invalid" {
			entry.InvalidFiles++ // Invalid file
			entry.Files = append(entry.Files, entities.HackingFileInfo{
				File:        doc.FileName,
				Time:        doc.Time,
				Institution: doc.Institution,
			})
		} else {
			if doc.Parent != "" {
				entry.Version++ // Valid file WITH parent
			} else {
				entry.FilesNumber++ // Valid file WITHOUT parent
			}
		}

	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor iteration error: %w", err)
	}

	// Map to slice
	var result []entities.HackingAttemptResponse
	for _, v := range phaseStats {
		result = append(result, *v)
	}
	return result, nil
}
