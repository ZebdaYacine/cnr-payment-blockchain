import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse, UsersResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetFiles(token:string): Promise<FilesResponse|ErrorResponse>;
  GetProfile(token:string): Promise<ProfileResponse|ErrorResponse>;
  GetFolder(token:string): Promise<FolderResponse|ErrorResponse>;
  GetUsers(token:string): Promise<UsersResponse|ErrorResponse>;
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,organisation :string,destination :string,version:number): Promise<FileResponse|ErrorResponse>;
  GetInstituations(token:string): Promise<InstitutionResponse|ErrorResponse>;
  GetChildOfInstitutions(id:string,name:string,token:string): Promise<ChildResponse|ErrorResponse>;
}