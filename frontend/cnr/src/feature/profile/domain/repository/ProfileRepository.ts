import { ErrorResponse } from "../../../../services/model/commun";
import { UploadResponse } from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  UploadFile(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<UploadResponse|ErrorResponse>;
}