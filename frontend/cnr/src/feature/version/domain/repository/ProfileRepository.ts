import { ErrorResponse } from "../../../../services/model/commun";
import { VersionsResponse } from "../../data/dtos/VersionsDtos";

export interface VersionRepository {
  GetVersions(token:string): Promise<VersionsResponse|ErrorResponse>;
  // GetProfile(token:string): Promise<ProfileResponse|ErrorResponse>;
  UploadVersions(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<VersionsResponse|ErrorResponse>;
}