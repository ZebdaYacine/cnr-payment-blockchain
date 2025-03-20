import { ErrorResponse } from "../../../../services/model/commun";
import { VersionsResponse, VersionsUploadResponse } from "../../data/dtos/VersionsDtos";
import { VersionRepository } from "../repository/VersionRepository";

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
    description: string ,folderName:string,hash_parent:string
  ): 
    Promise<VersionsUploadResponse|ErrorResponse> {
    return await this.repository.UploadVersions(
      filename,
      codebase64,
      token,action,
      parent,
      version,
      permission,
      commit,
      description,folderName,
      hash_parent,
    );
  }

  async GetVersions(token:string,permission:string,folder:string,parent:string): Promise<VersionsResponse|ErrorResponse> {
      return await  this.repository.GetVersions(token,permission,folder,parent);
  }


}
