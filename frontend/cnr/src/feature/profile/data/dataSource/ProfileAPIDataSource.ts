import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse, UsersResponse } from "../dtos/ProfileDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface ProfileDataSource {
  GetProfileApi(token: string,permission:string): Promise<ProfileResponse | ErrorResponse>;
  GetUsersApi(token: string,permission:string): Promise<UsersResponse | ErrorResponse>;
  GetFilesApi(token: string,permission:string): Promise<FilesResponse | ErrorResponse>;
  GetFolderApi(token: string,permission:string): Promise<FolderResponse | ErrorResponse>;
  UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    organisation :string,
    destination :string,
    version: number,permission:string
  ): Promise<FileResponse | ErrorResponse>;
  GetInstituaionApi(token: string,permission:string): Promise<InstitutionResponse | ErrorResponse>;
  GetChildOfInstitutionsApi(id:string,name:string,token: string,permission:string): Promise<ChildResponse | ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
 
  
  async GetProfileApi(token: string,permission:string): Promise<ProfileResponse | ErrorResponse> {
    return ApiService.makeRequest<ProfileResponse>("get", `/${permission}/get-profile`, token);
  }

  async GetUsersApi(token: string,permission:string): Promise<ProfileResponse | ErrorResponse> {
    return ApiService.makeRequest<ProfileResponse>("get", `/${permission}/bring-users`, token);
  }

  async GetFolderApi(token: string,permission:string): Promise<FolderResponse | ErrorResponse> {
    return ApiService.makeRequest<FolderResponse>("get", `/${permission}/get-folders`, token);
  }

  async GetFilesApi(token: string,permission:string): Promise<FilesResponse | ErrorResponse> {
    return ApiService.makeRequest<FilesResponse>("get", `/${permission}/get-all-files-metadata`, token);
  }

  GetInstituaionApi(token: string,permission:string): Promise<InstitutionResponse | ErrorResponse> {
    return ApiService.makeRequest<InstitutionResponse>("get", `/${permission}/get-institutions`, token);
  }

  GetChildOfInstitutionsApi(id:string,name:string,token: string,permission:string): Promise<ChildResponse | ErrorResponse> {
    return ApiService.makeRequest<ChildResponse>("get",
          `/${permission}/get-child-institutions?id=${id}&workAt=${name}`,
       token); 
  }
  

  async UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    organisation :string,
    destination :string,
    version: number,
    permission:string
  ): Promise<FileResponse | ErrorResponse> {
    return ApiService.makeRequest<FileResponse>("post", `/${permission}/upload-file`, token, {
      filename,
      codebase64,
      action,
      parent,
      folder,
      description,
      organisation ,
      destination ,
      version,
    });
  }
}
