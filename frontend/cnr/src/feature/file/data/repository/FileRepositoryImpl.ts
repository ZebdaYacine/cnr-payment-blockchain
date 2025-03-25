import { ErrorResponse } from "../../../../services/model/commun";
import { FileRepository } from "../../domain/repository/FileRepository";
import { FileDataSource } from "../dataSource/FileAPIDataSource";
import { Data, FileResponse, FilesResponse } from "../dtos/FileDtos";

export class FileRepositoryImpl implements FileRepository {
  datasource: FileDataSource;

  constructor(datasource: FileDataSource) {
    this.datasource = datasource;
  }

  async GetFiles(
    token: string,
    permission: string,
    folderName: string
  ): Promise<FilesResponse | ErrorResponse> {
    return await this.datasource.GetFilesApi(token, permission, folderName);
  }

  async UploadFile(
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
    return await this.datasource.UploadFileApi(
      filename,
      codebase64,
      token,
      action,
      parent,
      folder,
      description,
      organisation,
      destination,
      version,
      permission,
      reciverId,
      tagged_users,
      phase
    );
  }

  async DownloadFiles(
    files: Data[],
    token: string,
    permission: string
  ): Promise<boolean> {
    return await this.datasource.DownloadFilesApi(files, token, permission);
  }
}
