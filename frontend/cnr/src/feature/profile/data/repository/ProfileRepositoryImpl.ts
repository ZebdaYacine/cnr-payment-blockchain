import { UsersResponse } from './../dtos/ProfileDtos';
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse } from "../dtos/ProfileDtos";

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

  async GetUsers(token: string): Promise<UsersResponse | ErrorResponse> {
    return await this.datasource.GetUsersApi(token);
  }

  async GetFolder(token: string): Promise<FolderResponse | ErrorResponse> {
    return await this.datasource.GetFolderApi(token);
  }
  async GetFiles(token:string): Promise<FilesResponse | ErrorResponse> {
    return await this.datasource.GetFilesApi(token);
  }

  async UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,organisation :string,destination :string,version:number): Promise<FileResponse|ErrorResponse> {
    return await this.datasource.UploadFileApi(filename,codebase64,token,action,parent,folder,description,organisation ,destination,version);
  }
}
