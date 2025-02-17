import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, InstitutionResponse, ProfileResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetFiles(token:string): Promise<FilesResponse|ErrorResponse>;
  GetProfile(token:string): Promise<ProfileResponse|ErrorResponse>;
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<FileResponse|ErrorResponse>;
  GetInstituations(token:string): Promise<InstitutionResponse|ErrorResponse>;
  GetChildOfInstitutions(id:string,name:string,token:string): Promise<ChildResponse|ErrorResponse>;
}