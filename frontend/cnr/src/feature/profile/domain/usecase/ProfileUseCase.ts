import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse } from "../../data/dtos/ProfileDtos";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async UploadFile(
    filename: string,
    codebase64: string,
    token:string,action :string,
    parent:string,version:number): 
    Promise<FilesResponse|ErrorResponse> {
    return await this.repository.UploadFile(
      filename,
      codebase64,
      token,action,
      parent,
      version);
  }

  async GetFiles(token:string): Promise<FilesResponse|ErrorResponse> {
      return await  this.repository.GetFiles(token);
  }
}
