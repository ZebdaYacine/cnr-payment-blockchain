import { ErrorResponse } from "../../../../services/model/commun";
import { Data, FileResponse, FilesResponse } from "../../data/dtos/FileDtos";

export interface FileRepository {
  GetFiles(
    token: string,
    permission: string,
    folderName: string
  ): Promise<FilesResponse | ErrorResponse>;
  UploadFile(
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
  DownloadFiles(
    files: Data[],
    token: string,
    permission: string
  ): Promise<boolean>;
}
