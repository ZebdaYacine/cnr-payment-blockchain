import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { AuthRepository } from "../Repositories/AuthRepository";

export class LoginUseCase {
  repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(username: string, password: string): Promise<LoginResponse|ErrorResponse> {
    return await this.repository.Login(username, password);
  }
}
