import { FileResponse } from "../../data/dtos/FileDtos";
import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse } from "../../data/dtos/FileDtos";
import { FileRepository } from "../repository/FileRepository";
import { DownloadResponse } from "../../data/dtos/FileDtos";

export class FileUseCase {
  repository: FileRepository;

  constructor(repository: FileRepository) {
    this.repository = repository;
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
    return await this.repository.UploadFile(
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

  async GetFiles(
    token: string,
    permission: string,
    folderName: string
  ): Promise<FilesResponse | ErrorResponse> {
    return await this.repository.GetFiles(token, permission, folderName);
  }

  async DownloadFiles(
    fileIds: string[],
    token: string,
    permission: string
  ): Promise<DownloadResponse | ErrorResponse> {
    return await this.repository.DownloadFiles(fileIds, token, permission);
  }
}
