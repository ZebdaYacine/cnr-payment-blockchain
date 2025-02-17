import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";
import { ChildResponse, FilesResponse, InstitutionResponse, ProfileResponse } from "../dtos/ProfileDtos";

export class ProfileRepositoryImpl implements ProfileRepository {
  datasource: ProfileDataSource;

  constructor(datasource: ProfileDataSource) {
    this.datasource = datasource;
  }
  async GetChildOfInstitutions(id:string,name:string,token: string): Promise<ChildResponse | ErrorResponse> {
     return await this.datasource.GetChildOfInstitutionsApi(id,name,token);
  }
  async GetInstituations(token: string): Promise<InstitutionResponse | ErrorResponse> {
    return await this.datasource.GetInstituaionApi(token);
  }
  async GetProfile(token: string): Promise<ProfileResponse | ErrorResponse> {
    return await this.datasource.GetProfileApi(token);
  }
  async GetFiles(token:string): Promise<FilesResponse | ErrorResponse> {
    return await this.datasource.GetFilesApi(token);
  }

  async UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<FilesResponse|ErrorResponse> {
    return await this.datasource.UploadFileApi(filename,codebase64,token,action,parent,version);
  }
}
