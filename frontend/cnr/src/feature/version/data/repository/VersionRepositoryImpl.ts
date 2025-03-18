import { ErrorResponse } from "../../../../services/model/commun";
import { VersionRepository } from "../../domain/repository/VersionRepository";
import { VersionsDataSource } from "../dataSource/VersionsDataSource";
import { VersionsResponse } from "../dtos/VersionsDtos";

export class VersionRepositoryImpl implements VersionRepository {
  datasource: VersionsDataSource;

  constructor(datasource: VersionsDataSource) {
    this.datasource = datasource;
  }

  async GetVersions(token:string): Promise<VersionsResponse | ErrorResponse> {
    return await this.datasource.GetVersionsApi(token);
  }

  async UploadVersions(filename: string,codebase64: string,token:string,
    action :string,parent:string,last_version:number, permission: string, 
    commit: string,description: string,folderName:string,hash_parent:string): Promise<VersionsResponse|ErrorResponse> {
    return await this.datasource.UploadVersionsApi(filename,codebase64,token,action,parent,last_version,permission,commit,description,folderName,hash_parent);
  }
}
