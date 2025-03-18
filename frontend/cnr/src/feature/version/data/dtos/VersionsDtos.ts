import { User } from "../../../../core/dtos/data";


export interface VersionsResponse {
  message: string;
  data: VersionData[] ;
}


export interface VersionData {
  ID: string;
  HashFile: string;
  UserID: string;
  FileName: string;
  Parent: string;
  Note: number;
  Path:string;
  Action: string;
  Time: string;
  Organisation: string;
  Status: string;
}

export interface CommitData {
  ID: string;
  User: User;
  Body: string;
  Time:string;

}

