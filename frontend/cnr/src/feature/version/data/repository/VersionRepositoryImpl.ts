import { ErrorResponse } from "../../../../services/model/commun";
import { VersionRepository } from "../../domain/repository/ProfileRepository";
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
    action :string,parent:string,version:number, permission: string, commit: string,description: string,folderName:string ): Promise<VersionsResponse|ErrorResponse> {
    return await this.datasource.UploadVersionsApi(filename,codebase64,token,action,parent,version,permission,commit,description,folderName);
  }
}
