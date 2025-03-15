import { ErrorResponse } from "../../../../services/model/commun";
import {  FileResponse, FilesResponse  } from "../../data/dtos/ProfileDtos";

export interface FileRepository {
  GetFiles(permission: string,token:string,folder:string): Promise<FilesResponse|ErrorResponse>;
  UploadFile(permission: string,filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,version:number): Promise<FileResponse|ErrorResponse>;
}