import { ErrorResponse } from "../../../../services/model/commun";
import { UploadResponse } from "../../data/dtos/ProfileDtos";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async execute(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<UploadResponse|ErrorResponse> {
    return await this.repository.UploadFile(filename,codebase64,token,action,parent,version);
  }
}
