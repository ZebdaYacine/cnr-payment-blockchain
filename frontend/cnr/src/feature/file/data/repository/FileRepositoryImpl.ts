import { ErrorResponse } from "../../../../services/model/commun";
import { FileRepository } from "../../domain/repository/FileRepository";
import { FileDataSource } from "../dataSource/FileAPIDataSource";
import {  FileResponse, FilesResponse } from "../dtos/FileDtos";

export class FileRepositoryImpl implements FileRepository {
  datasource: FileDataSource;

  constructor(datasource: FileDataSource) {
    this.datasource = datasource;
  }
 

  async GetFiles(permission:string,token:string,folder:string): Promise<FilesResponse | ErrorResponse> {
    return await this.datasource.GetFilesApi(permission,token,folder);
  }

  async UploadFile(permission:string,filename: string,codebase64: string,token:string,action :string,parent:string,folder:string,description:string,version:number): Promise<FileResponse|ErrorResponse> {
    return await this.datasource.UploadFileApi(permission,filename,codebase64,token,action,parent,folder,description,version);
  }
}
