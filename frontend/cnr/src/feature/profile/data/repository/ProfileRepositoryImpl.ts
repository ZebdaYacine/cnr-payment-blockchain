import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";
import { UploadResponse } from "../dtos/ProfileDtos";

export class ProfileRepositoryImpl implements ProfileRepository {
  datasource: ProfileDataSource;

  constructor(datasource: ProfileDataSource) {
    this.datasource = datasource;
  }

  async UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<UploadResponse|ErrorResponse> {
    return await this.datasource.UploadFileApi(filename,codebase64,token,action,parent,version);
  }
}
