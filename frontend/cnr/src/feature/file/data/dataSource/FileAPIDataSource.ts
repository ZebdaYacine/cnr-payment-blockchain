import { ErrorResponse } from "../../../../services/model/commun";
import { FileResponse, FilesResponse } from "../dtos/FileDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface FileDataSource {
  GetFilesApi(
    token: string,
    permission: string,
    folder: string
  ): Promise<FilesResponse | ErrorResponse>;
  UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder: string,
    description: string,
    organisation: string,
    destination: string,
    version: number,
    permission: string,
    reciverId: string,
    tagged_users: string[],
    phase: string
  ): Promise<FileResponse | ErrorResponse>;
}

export class FileDataSourceImpl implements FileDataSource {
  async GetFilesApi(
    token: string,
    permission: string,
    folderName: string
  ): Promise<FilesResponse | ErrorResponse> {
    return ApiService.makeRequest<FilesResponse>(
      "get",
      `/${permission}/get-all-files-metadata?folder=${folderName}`,
      token
    );
  }

  async UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder: string,
    description: string,
    organisation: string,
    destination: string,
    version: number,
    permission: string,
    reciverId: string,
    tagged_users: string[],
    phase: string
  ): Promise<FileResponse | ErrorResponse> {
    return ApiService.makeRequest<FileResponse>(
      "post",
      `/${permission}/upload-file`,
      token,
      {
        filename,
        codebase64,
        action,
        parent,
        folder,
        description,
        organisation,
        destination,
        version,
        reciverId,
        tagged_users,
        phase,
      }
    );
  }
}
