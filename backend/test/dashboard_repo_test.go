package test

import (
	"context"
	"log"
	repo "scps-backend/feature/dashboard/domain/repository"
	"scps-backend/pkg/database"
	"testing"
)

func TestUserRepository(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		t.Setenv("SERVER_ADDRESS_DB", "mongodb://localhost:27017/")
		t.Setenv("DB_NAME", "cnr-blockchain")
		db := database.ConnectionDb()
		if db == nil {
			t.Fatal("Database connection failed")
		}
		ctx := context.Background()
		pr := repo.NewDashboardRepository(db)
		if pr == nil {
			t.Fatal("Failed to init NewDashboardRepository")
		}
		r, err := pr.WorkersNotSubmittedFiles(ctx)
		if err != nil {
			t.Fatalf("Failed to get  WorkerErrorRateResponse: %v", err)
		}
		log.Println(r)
	})
}
