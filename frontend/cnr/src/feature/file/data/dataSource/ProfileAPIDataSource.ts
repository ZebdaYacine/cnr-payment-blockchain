import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, FolderResponse, InstitutionResponse, ProfileResponse } from "../dtos/ProfileDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface ProfileDataSource {
  GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse>;
  GetFilesApi(token: string,folder:string): Promise<FilesResponse | ErrorResponse>;
  GetFolderApi(token: string): Promise<FolderResponse | ErrorResponse>;
  UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    version: number
  ): Promise<FileResponse | ErrorResponse>;
  GetInstituaionApi(token: string): Promise<InstitutionResponse | ErrorResponse>;
  GetChildOfInstitutionsApi(id:string,name:string,token: string): Promise<ChildResponse | ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
 
  
  async GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse> {
    return ApiService.makeRequest<ProfileResponse>("get", "/user/get-profile", token);
  }

  async GetFolderApi(token: string): Promise<FolderResponse | ErrorResponse> {
    return ApiService.makeRequest<FolderResponse>("get", "/user/get-folders", token);
  }

  async GetFilesApi(token: string,folder:string): Promise<FilesResponse | ErrorResponse> {
    return ApiService.makeRequest<FilesResponse>("get", "/user/get-all-files-metadata?folder="+folder, token);
  }

  GetInstituaionApi(token: string): Promise<InstitutionResponse | ErrorResponse> {
    return ApiService.makeRequest<InstitutionResponse>("get", "/user/get-institutions", token);
  }

  GetChildOfInstitutionsApi(id:string,name:string,token: string): Promise<ChildResponse | ErrorResponse> {
    return ApiService.makeRequest<ChildResponse>("get", "/user/get-child-institutions?id="+id+"&workAt="+name,token); 
  }
  

  async UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder:string,
    description:string,
    version: number
  ): Promise<FileResponse | ErrorResponse> {
    return ApiService.makeRequest<FileResponse>("post", "/user/upload-file", token, {
      filename,
      codebase64,
      action,
      parent,
      folder,
      description,
      version,
    });
  }
}
