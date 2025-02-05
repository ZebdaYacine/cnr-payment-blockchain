export interface FilesResponse {
  message: string;
  data: Data[] ;
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

export interface Data {
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