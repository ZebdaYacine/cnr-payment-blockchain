import { ErrorResponse } from "../../../../services/model/commun";
import { VersionsResponse } from "../../data/dtos/VersionsDtos";
import { VersionRepository } from "../repository/ProfileRepository";

export class VersionUseCase {
  repository: VersionRepository;

  constructor(repository: VersionRepository) {
    this.repository = repository;
  }

  async UploadVersion(
    filename: string,
    codebase64: string,
    token:string,action :string,
    parent:string,version:number,permission: string,
    commit: string,
    description: string ,folderName:string
  ): 
    Promise<VersionsResponse|ErrorResponse> {
    return await this.repository.UploadVersions(
      filename,
      codebase64,
      token,action,
      parent,
      version,
      permission,
      commit,
      description,folderName
    );
  }

  async GetVersions(token:string): Promise<VersionsResponse|ErrorResponse> {
      return await  this.repository.GetVersions(token);
  }


}
