import { User } from "../../../../core/dtos/data";


export interface VersionsResponse {
  message: string;
  data: VersionData[] ;
}

export interface VersionRequest {
  UserID: string;
  FileBase64: string;
  FileName: string;
  Parent: string;
  Commit: string;
  Time: string;
  Description: string;
  Version: string;
}


export interface VersionData {
  ID: string;
  HashFile: string;
  UserID: string;
  FileName: string;
  Parent: string;
  Commit: string;
  Description: string;
  Path:string;
  Action: string;
  Time: string;
  Organisation: string;
  Status: string;
  Version:string,
  LastVersion:string
}

export interface CommitData {
  ID: string;
  User: User;
  Body: string;
  Time:string;

}

