import { ErrorResponse } from "../../../../services/model/commun";
import {
  Data,
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
    files: Data[],
    token: string,
    permission: string
  ): Promise<boolean>;

  DownloadFilesOfFolderApi(
    folder: string,
    token: string,
    permission: string
  ): Promise<boolean>;
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
    files: Data[],
    token: string,
    permission: string
  ): Promise<boolean> {
    try {
      const response = await ApiService.makeDownloadRequest(
        "post",
        `/${permission}/download-files`,
        token,
        { files }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const size = files.length;
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${size}.zip`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      console.error("Download failed:", error);
      return false;
    }
  }

  async DownloadFilesOfFolderApi(
    folder: string,
    token: string,
    permission: string
  ): Promise<boolean> {
    try {
      const response = await ApiService.makeDownloadRequest(
        "post",
        `/${permission}/download-folder`,
        token,
        { folder }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${folder.split("/").pop() || "folder"}.zip`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      console.error("Folder download failed:", error);
      return false;
    }
  }
}
