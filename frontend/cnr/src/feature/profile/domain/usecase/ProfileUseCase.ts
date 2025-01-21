import { UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async execute(filename: string,codebase64: string,token:string): Promise<UploadResponse|ErrorResponse> {
    return await this.repository.UploadFile(filename,codebase64,token);
  }
}
