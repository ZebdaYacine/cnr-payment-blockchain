import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetFiles(token:string): Promise<FilesResponse|ErrorResponse>;
  GetProfile(token:string): Promise<ProfileResponse|ErrorResponse>;
  GetFolder(token:string): Promise<FolderResponse|ErrorResponse>;
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,version:number): Promise<FileResponse|ErrorResponse>;
  GetInstituations(token:string): Promise<InstitutionResponse|ErrorResponse>;
  GetChildOfInstitutions(id:string,name:string,token:string): Promise<ChildResponse|ErrorResponse>;
}