import { ErrorResponse } from "../../../../services/model/commun";
import {FileResponse, FilesResponse } from "../dtos/FileDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface FileDataSource {
  GetFilesApi(permission:string,token: string,folder:string): Promise<FilesResponse | ErrorResponse>;
  UploadFileApi(
    permission:string,
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    version: number
  ): Promise<FileResponse | ErrorResponse>;
}

export class FileDataSourceImpl implements FileDataSource {
 
  async GetFilesApi(permission:string,token: string,folder:string): Promise<FilesResponse | ErrorResponse> {
    return ApiService.makeRequest<FilesResponse>("get", `/${permission}/get-all-files-metadata?folder=${folder}`, token);
  }

  async UploadFileApi(
    permission:string,
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    version: number
  ): Promise<FileResponse | ErrorResponse> {
    return ApiService.makeRequest<FileResponse>("post", `/${permission}/upload-file`, token, {
      filename,
      codebase64,
      action,
      parent,
      folder,
      description,
      version,
    });
  }
}
