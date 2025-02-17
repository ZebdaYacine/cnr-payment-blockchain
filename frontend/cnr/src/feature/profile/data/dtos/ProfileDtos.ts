import { User } from "../../../../core/dtos/data";

export interface FilesResponse {
  message: string;
  data: Data[] ;
}

export interface ChildResponse {
  message: string;
  data: Elements ;
}

export interface Peer {
  obj: unknown; 
  type: string; 
}
export interface Elements {
  institutiont: Peer; 
  child: Peer[]; 
}

export interface InstitutionResponse {
  message: string;
  data: Institution[] ;
}

export interface ProfileResponse {
  message: string;
  data: User ;
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

export interface Institution {
  ID: string;
  Name: string;
}

export interface Child {
  ID: string;
  Name: string;
  Parent:Institution;
}


