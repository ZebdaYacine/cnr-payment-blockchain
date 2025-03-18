import { ErrorResponse } from "../../../../services/model/commun";
import { VersionsResponse } from "../dtos/VersionsDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface VersionsDataSource {
  // GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse>;
  GetVersionsApi(token: string): Promise<VersionsResponse | ErrorResponse>;
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

export class ProfileDataSourceImpl implements VersionsDataSource {




  async GetVersionsApi(token: string): Promise<VersionsResponse | ErrorResponse> {
    return ApiService.makeRequest<VersionsResponse>("get", "/user/get-all-files-metadata", token);
  }

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
  ): Promise<VersionsResponse | ErrorResponse> {
    return ApiService.makeRequest<VersionsResponse>("post", `/${permission}/upload-veriosn`, token, {
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
