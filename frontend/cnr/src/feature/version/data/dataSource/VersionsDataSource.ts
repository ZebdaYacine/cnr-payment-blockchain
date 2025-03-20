import { ErrorResponse } from "../../../../services/model/commun";
import { VersionsResponse, VersionsUploadResponse } from "../dtos/VersionsDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface VersionsDataSource {
  // GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse>;
  GetVersionsApi(token: string,permission:string,folder:string,parent:string): Promise<VersionsResponse | ErrorResponse>;
  UploadVersionsApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    version:number,
    permission: string,
    commit: string,
    description: string ,folderName:string,hash_parent:string
  ): Promise<VersionsResponse | ErrorResponse>;
}

export class VersionDataSourceImpl implements VersionsDataSource {




  async GetVersionsApi(token: string,permission:string,folder:string,parent:string): Promise<VersionsResponse | ErrorResponse> {    
return ApiService.makeRequest<VersionsResponse>(
  "get",
  `/${permission}/get-versions?folder=${folder}&parent=${parent}`,
  token
);  }

  async UploadVersionsApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    version:number,
    permission: string,
     commit: string,
    description: string ,folderName:string,
    hash_parent:string
  ): Promise<VersionsUploadResponse | ErrorResponse> {
    return ApiService.makeRequest<VersionsResponse>("post", `/${permission}/upload-version`, token, {
      filename,
      codebase64,
      action,
      parent,
      version,
      commit,
      description ,
      folderName,
      hash_parent,
    });
  }
}
