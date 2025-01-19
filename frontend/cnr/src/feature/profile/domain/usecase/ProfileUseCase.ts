import { UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async execute(file: string): Promise<UploadResponse|ErrorResponse> {
    return await this.repository.UploadFile(file);
  }
}
