import { User } from "../../../../core/dtos/data";



export interface ChildResponse {
  message: string;
  data: Elements;
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
  data: Institution[];
}



export interface ProfileResponse {
  message: string;
  data: User;
}

export interface UsersResponse {
  message: string;
  data: User[];
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

export interface PhaseResponse {
  id: string;
  name: string;
  description: string;
  number: number;
  startAt: number;
  endAt: number;
}

export interface Institution {
  id: string;
  name: string;
}



export interface Child {
  id: string;
  name: string;
  type: string;
  wilaya: string;
  org: Institution;
}
