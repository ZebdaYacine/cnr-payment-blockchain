export interface FileResponse {
  message: string;
  data: Data;
}

export interface FilesResponse {
  message: string;
  data: Data[];
}

export interface Data {
  ID: string;
  FileName: string;
  HashFile: string;
  Time: string;
  Status: string;
  Version: number;
  LastVersion: number;
  reciverId: string;
  Organisation?: string;
  path?: string;
  TaggedUsers?: string[];
}

export interface DownloadResponse {
  data: {
    fileUrl: string;
    fileName: string;
  }[];
  message: string;
  status: number;
}
