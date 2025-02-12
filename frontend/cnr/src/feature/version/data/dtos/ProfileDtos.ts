export interface FilesResponse {
  message: string;
  data: FileData[] ;
}

export interface ProfileResponse {
  message: string;
  data: User ;
}

export interface User {
  username: string;
  email: string;
  permission: string;
}

export interface FileData {
  ID: string;
  HashFile: string;
  UserID: string;
  FileName: string;
  Parent: string;
  Version: number;
  Action: string;
  Time: string;
  Organisation: string;
  Status: string;
}

export interface VersionData {
  ID: string;
  HashFile: string;
  UserID: string;
  FileName: string;
  Parent: string;
  Note: number;
  Action: string;
  Time: string;
  Organisation: string;
  Status: string;
}

