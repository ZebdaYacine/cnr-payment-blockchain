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
  HashFile: string;
  UserID: string;
  FileName: string;
  Parent: string;
  Version: number;
  LastVersion: number;
  Action: string;
  Time: string;
  Organisation: string;
  Status: string;
  TaggedUsers: string[];
  reciverId: string;
}
