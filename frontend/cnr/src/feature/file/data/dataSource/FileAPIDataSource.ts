import { ErrorResponse } from "../../../../services/model/commun";
import {
  FileResponse,
  FilesResponse,
  // DownloadResponse,
} from "../dtos/FileDtos";
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
  // DownloadFilesApi(
  //   fileIds: string[],
  //   token: string,
  //   permission: string
  // ): Promise<DownloadResponse | ErrorResponse>;

  DownloadFilesApi(
    fileIds: string[],
    token: string,
    permission: string
  ): Promise<void>;
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

  // async DownloadFilesApi(
  //   filePaths: string[],
  //   token: string,
  //   permission: string
  // ): Promise<DownloadResponse | ErrorResponse> {
  //   return ApiService.makeRequest<DownloadResponse>(
  //     "post",
  //     `/${permission}/download-files`,
  //     token,
  //     {
  //       filePaths,
  //       token,
  //       permission,
  //     }
  //   );
  // }
  async DownloadFilesApi(
    filePaths: string[],
    token: string,
    permission: string
  ): Promise<void> {
    try {
      const response = await ApiService.makeDownloadRequest(
        "post",
        `/${permission}/download-files`,
        token,
        { filePaths }
      );

      // Create blob and download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      // Optional: parse filename from headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : "files.zip";

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      // optionally toast or handle error
    }
  }
}
