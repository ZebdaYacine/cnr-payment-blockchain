package usecase

import (
	"context"
	"fmt"
	"scps-backend/feature"
	"scps-backend/feature/auth/domain/entities"
	"scps-backend/feature/auth/domain/repository"
)

type AuthParams struct {
	Data any
}

type AuthResult struct {
	Data any
	Err  error
}

func (l *AuthParams) validator() error {
	fmt.Printf("Data type: %T\n", l.Data) // Debugging statement to show the type
	switch l.Data.(type) {
	case *entities.Login:
		params := l.Data.(*entities.Login)
		if params.UserName == "" {
			return fmt.Errorf("email cannot be empty")
		}
		if params.Password == "" {
			return fmt.Errorf("password cannot be empty")
		}
	case *entities.SetPwd:
		params := l.Data.(*entities.SetPwd)
		if params.Email == "" {
			return fmt.Errorf("email cannot be empty")
		}
		if params.Pwd1 == "" {
			return fmt.Errorf("password 1 est vide")
		}
		if params.Pwd2 == "" {
			return fmt.Errorf("password 2 est vide")
		}
		if params.Pwd1 != params.Pwd2 {
			return fmt.Errorf("password 1 et 2 ne sont pas identiques")
		}
		return nil
	default:
		return fmt.Errorf("invalid data type")
	}
	return nil
}

type AuthUsecase interface {
	//AUTH FUNCTIONS
	Login(c context.Context, data *AuthParams) *AuthResult
	SetPassword(c context.Context, data *AuthParams) *AuthResult
	SearchIfEamilExiste(c context.Context, data *AuthParams) *AuthResult
	CreateAccount(c context.Context, user *AuthParams) *AuthResult
}

type authUsecase struct {
	repo       repository.AuthRepository
	collection string
}

func NewAuthUsecase(repo repository.AuthRepository, collection string) AuthUsecase {
	return &authUsecase{
		repo:       repo,
		collection: collection,
	}
}

// Login implements UserUsecase.
func (u *authUsecase) Login(c context.Context, data *AuthParams) *AuthResult {
	// fabric.SdkProvider("init")
	if err := data.validator(); err != nil {
		return &AuthResult{Err: err}
	}
	loginResult, err := u.repo.Login(c, data.Data.(*entities.Login))
	if err != nil {
		return &AuthResult{Err: err}
	}
	return &AuthResult{Data: loginResult}
}

// SetPassword implements AuthUsecase.
func (u *authUsecase) SetPassword(c context.Context, data *AuthParams) *AuthResult {
	if err := data.validator(); err != nil {
		return &AuthResult{Err: err}
	}
	result, err := u.repo.SetPassword(c, data.Data.(*entities.SetPwd).Pwd1, data.Data.(*entities.SetPwd).Email)
	if err != nil {
		return &AuthResult{Err: err}
	}
	return &AuthResult{Data: result}
}

func (p *authUsecase) SearchIfEamilExiste(c context.Context, email *AuthParams) *AuthResult {
	data := email.Data.(*entities.SetEmail)
	profileResult, err := p.repo.SearchIfEamilExiste(c, data.Email)
	if err != nil {
		return &AuthResult{Err: err}
	}
	return &AuthResult{Data: profileResult}
}

func (p *authUsecase) CreateAccount(c context.Context, user *AuthParams) *AuthResult {
	profileResult, err := p.repo.CreateAccount(c, user.Data.(*feature.User))
	if err != nil {
		return &AuthResult{Err: err}
	}
	return &AuthResult{Data: profileResult}
}
