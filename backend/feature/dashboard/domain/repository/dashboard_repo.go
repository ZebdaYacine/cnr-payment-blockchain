package repository

import (
	"context"
	"fmt"
	"sort"
	"time"

	"scps-backend/feature"
	"scps-backend/feature/dashboard/domain/entities"
	entitiesFile "scps-backend/feature/home/file/domain/entities"
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
	WorkersNotSubmittedFiles(c context.Context) ([]entities.WorkerSubmitFilesResponse, error)
	GetHackingAttemptStats(c context.Context) ([]entities.HackingAttemptResponse, error)
}

func NewDashboardRepository(db database.Database) DashBoardRepository {
	return &dashboardRepository{database: db}
}

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

		if _, exists := institutionMap[groupKey][doc.Institution]; !exists {
			institutionMap[groupKey][doc.Institution] = &entities.InstitutionDetail{
				Name:    doc.Institution,
				File:    0,
				Version: 0,
			}
		}
		inst := institutionMap[groupKey][doc.Institution]

		if doc.Parent == "" {
			group.File++
			inst.File++
		} else {
			group.Version++
			inst.Version++
		}
	}

	var result []entities.UploadStats
	for key, group := range groupMap {
		for _, inst := range institutionMap[key] {
			group.Institutions = append(group.Institutions, *inst)
		}
		result = append(result, *group)
	}

	return result, nil
}

func getUserIDs(users []feature.User) []string {
	ids := make([]string, len(users))
	for i, user := range users {
		ids[i] = user.ID.Hex()
	}
	return ids
}

func (r *dashboardRepository) WorkersNotSubmittedFiles(ctx context.Context) ([]entities.WorkerSubmitFilesResponse, error) {
	phase, err := r.GetCurrentPhaseByID(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current phase: %w", err)
	}
	if phase == nil {
		return nil, fmt.Errorf("phase not found")
	}

	userCol := r.database.Collection(database.USER.String())
	userCursor, err := userCol.Find(ctx, bson.M{
		"phases": bson.M{
			"$elemMatch": bson.M{
				"id":        phase.ID.Hex(),
				"is_sender": true,
			},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	defer userCursor.Close(ctx)

	var users []feature.User
	if err := userCursor.All(ctx, &users); err != nil {
		return nil, fmt.Errorf("failed to decode users: %w", err)
	}

	if len(users) == 0 {
		return []entities.WorkerSubmitFilesResponse{}, nil
	}

	// Get all files for these users in the current phase
	fileCol := r.database.Collection(database.FILE.String())
	fileCursor, err := fileCol.Find(ctx, bson.M{
		"phase":   phase.ID.Hex(),
		"user_id": bson.M{"$in": getUserIDs(users)},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to query files: %w", err)
	}
	defer fileCursor.Close(ctx)

	var files []entitiesFile.Data
	if err := fileCursor.All(ctx, &files); err != nil {
		return nil, fmt.Errorf("failed to decode files: %w", err)
	}

	// Create a map to track users who submitted files
	hasSubmitted := make(map[string]bool)
	for _, file := range files {
		hasSubmitted[file.UserId] = true
	}

	// Prepare response with only users who didn't submit files
	workers := make([]entities.WorkerSubmitFilesResponse, 0)
	for _, user := range users {
		// Skip users who submitted files
		if hasSubmitted[user.ID.Hex()] {
			continue
		}

		workers = append(workers, entities.WorkerSubmitFilesResponse{
			UserID:    user.Id,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Wilaya:    user.Wilaya,
			WorkAt:    user.WorkAt,
			Type:      user.Type,
			Submitted: false, // Always false since we filtered them out
		})
	}

	return workers, nil
}

// --- Hacking Attempts ---
func (r *dashboardRepository) GetPhaseByID(ctx context.Context, id string) (*Phase, error) {
	collection := r.database.Collection(database.PHASE.String())

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid ID format: %w", err)
	}

	filter := bson.M{
		"_id": objectID,
	}

	var phase Phase
	err = collection.FindOne(ctx, filter).Decode(&phase)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch phase by ID: %w", err)
	}

	return &phase, nil
}

func (r *dashboardRepository) GetCurrentPhaseByID(ctx context.Context) (*Phase, error) {
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
	return &phase, nil
}

func (r *dashboardRepository) GetHackingAttemptStats(ctx context.Context) ([]entities.HackingAttemptResponse, error) {
	collection := r.database.Collection(database.FILE.String())

	// Get current month range
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	lastOfMonth := firstOfMonth.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	// Query for documents from current month
	cursor, err := collection.Find(ctx, bson.M{
		"time": bson.M{
			"$gte": firstOfMonth.Format(time.RFC3339),
			"$lte": lastOfMonth.Format(time.RFC3339),
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to query documents: %w", err)
	}
	defer cursor.Close(ctx)

	phaseStats := make(map[string]*entities.HackingAttemptResponse)
	folderTracker := make(map[string]map[string]struct{})      // phase -> folder names
	institutionTracker := make(map[string]map[string]struct{}) // phase -> institution names

	for cursor.Next(ctx) {
		var doc struct {
			Phase       string `bson:"phase"`
			FileName    string `bson:"file_name"`
			Institution string `bson:"organisation"`
			Parent      string `bson:"parent"`
			Folder      string `bson:"folder"`
			Status      string `bson:"status"`
			Time        string `bson:"time"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		phaseName, err := r.GetPhaseByID(ctx, doc.Phase)
		if err != nil || phaseName == nil {
			continue
		}
		phase := phaseName.Name

		// Initialize phase entry if not exists
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

		// Track unique folders
		if _, ok := folderTracker[phase][doc.Folder]; !ok && doc.Folder != "" {
			folderTracker[phase][doc.Folder] = struct{}{}
			entry.Folder = len(folderTracker[phase])
		}

		// Track unique institutions
		if _, ok := institutionTracker[phase][doc.Institution]; !ok && doc.Institution != "" {
			institutionTracker[phase][doc.Institution] = struct{}{}
			entry.Institutions = append(entry.Institutions, doc.Institution)
		}

		// Count files based on status and parent
		if doc.Status == "Invalid" {
			entry.InvalidFiles++
			entry.Files = append(entry.Files, entities.HackingFileInfo{
				File:        doc.FileName,
				Time:        doc.Time,
				Institution: doc.Institution,
			})
		} else {
			if doc.Parent != "" {
				entry.Version++
			} else {
				entry.FilesNumber++
			}
		}
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor iteration error: %w", err)
	}

	// Convert map to slice
	var result []entities.HackingAttemptResponse
	for _, v := range phaseStats {
		// Sort institutions alphabetically
		sort.Strings(v.Institutions)
		result = append(result, *v)
	}

	return result, nil
}
