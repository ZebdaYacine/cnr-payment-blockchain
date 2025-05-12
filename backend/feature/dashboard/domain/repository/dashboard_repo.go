package repository

import (
	"context"
	"log"
	"strconv"
	"time"

	"scps-backend/feature/dashboard/domain/entities"
	"scps-backend/pkg/database"

	"go.mongodb.org/mongo-driver/bson"
)

type dashboardRepository struct {
	database database.Database
}

type DashBoardRepository interface {
	GetUploadingFilesVersionStats(c context.Context) ([]entities.UploadedFileInfo, error)
	GetWorkersErrorRate(c context.Context) ([]entities.WorkerErrorRateResponse, error)
	GetHackingAttemptStats(c context.Context) ([]entities.HackingAttemptResponse, error)
}

func NewDashboardRepository(db database.Database) DashBoardRepository {
	return &dashboardRepository{database: db}
}

// --- Uploading Files & Versions ---

func (r *dashboardRepository) GetUploadingFilesVersionStats(ctx context.Context) ([]entities.UploadedFileInfo, error) {
	collection := r.database.Collection(database.FILE.String())

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	currentYear := time.Now().Year()
	resultMap := map[string]*entities.UploadedFileInfo{}

	for cursor.Next(ctx) {
		var doc struct {
			Time        string `bson:"time"`
			Version     string `bson:"version"`
			Institution string `bson:"organisation"`
			FileName    string `bson:"file_name"`
		}

		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		parsedTime, err := time.Parse(time.RFC3339, doc.Time)
		if err != nil || parsedTime.Year() != currentYear {
			continue
		}

		versionInt, err := strconv.Atoi(doc.Version)
		if err != nil {
			continue
		}

		day := parsedTime.Format("02")
		month := parsedTime.Format("January")
		year := parsedTime.Format("2006")
		key := day + "_" + month + "_" + year + "_" + doc.Institution

		if _, exists := resultMap[key]; !exists {
			resultMap[key] = &entities.UploadedFileInfo{
				File:        0,
				Version:     0,
				Day:         day,
				Month:       month,
				Year:        year,
				Institution: doc.Institution,
			}
		}

		entry := resultMap[key]
		entry.File++
		entry.Version += versionInt
	}

	var result []entities.UploadedFileInfo
	for _, v := range resultMap {
		result = append(result, *v)
	}

	log.Println(result)
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

func (r *dashboardRepository) GetHackingAttemptStats(ctx context.Context) ([]entities.HackingAttemptResponse, error) {
	collection := r.database.Collection(database.FILE.String())
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	resultMap := map[string]*entities.HackingAttemptResponse{}

	for cursor.Next(ctx) {
		var doc struct {
			Phase       string `bson:"phase"`
			Version     int    `bson:"version"`
			Time        string `bson:"time"`
			FileName    string `bson:"file"`
			Institution string `bson:"organisation"`
		}
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		key := doc.Phase
		if _, exists := resultMap[key]; !exists {
			resultMap[key] = &entities.HackingAttemptResponse{
				Phase:        doc.Phase,
				Version:      0,
				FilesNumber:  0,
				InvalidFiles: 0,
				Folder:       0,
				Institutions: []string{},
				Files:        []entities.HackingFileInfo{},
			}
		}

		entry := resultMap[key]
		entry.Version += doc.Version
		entry.FilesNumber++
		entry.Institutions = append(entry.Institutions, doc.Institution)
		entry.Files = append(entry.Files, entities.HackingFileInfo{
			File:        doc.FileName,
			Time:        doc.Time,
			Institution: doc.Institution,
		})
	}

	var result []entities.HackingAttemptResponse
	for _, v := range resultMap {
		result = append(result, *v)
	}
	return result, nil
}
