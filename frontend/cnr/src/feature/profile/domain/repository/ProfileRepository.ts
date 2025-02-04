import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetFiles(token:string): Promise<FilesResponse|ErrorResponse>;
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<FilesResponse|ErrorResponse>;
}