import { AuthRepository } from "../Repositories/AuthRepository";

export class LoginUseCase {
  repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(username: string, password: string): Promise<string> {
    return await this.repository.Login(username, password);
  }
}
