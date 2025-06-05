package test

import (
	"context"
	"log"
	repo "scps-backend/feature/home/institutions/domain/repository"
	"scps-backend/pkg/database"
	"testing"
)

func TestPeersRepository(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		t.Setenv("SERVER_ADDRESS_DB", "mongodb://localhost:27017/")
		t.Setenv("DB_NAME", "cnr-blockchain")
		db := database.ConnectionDb()
		if db == nil {
			t.Fatal("Database connection failed")
		}
		ctx := context.Background()
		pr := repo.NewInstitutionsRepository(db)
		if pr == nil {
			t.Fatal("Failed to init NewDashboardRepository")
		}
		r, err := pr.BringUsers(ctx, "6789313a801dade18041ef17")
		if err != nil {
			t.Fatalf("Failed to get  WorkerErrorRateResponse: %v", err)
		}
		for _, user := range r {
			log.Println(user.Id, user.Email, user.WorkAt)
		}
	})
}
