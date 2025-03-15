import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse, UsersResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetFiles(token:string,permission:string): Promise<FilesResponse|ErrorResponse>;
  GetProfile(token:string,permission:string): Promise<ProfileResponse|ErrorResponse>;
  GetFolder(token:string,permission:string): Promise<FolderResponse|ErrorResponse>;
  GetUsers(token:string,permission:string): Promise<UsersResponse|ErrorResponse>;
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,organisation :string,destination :string,version:number,permission:string): Promise<FileResponse|ErrorResponse>;
  GetInstituations(token:string,permission:string): Promise<InstitutionResponse|ErrorResponse>;
  GetChildOfInstitutions(id:string,name:string,token:string,permission:string): Promise<ChildResponse|ErrorResponse>;
}