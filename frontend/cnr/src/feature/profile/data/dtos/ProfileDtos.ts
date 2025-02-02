export interface UploadResponse {
  message: string;
  data: Data[] ;
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
}