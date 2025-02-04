import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse } from "../dtos/ProfileDtos";

export interface ProfileDataSource {
  GetFilesApi(token:string): Promise<FilesResponse|ErrorResponse>;
  UploadFileApi(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<FilesResponse|ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
  async GetFilesApi(token: string): Promise<FilesResponse | ErrorResponse> {
    try {
      const response = await Http.post<FilesResponse>("/user/get-all-files-metadata", 
      {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' +token
          }
      }
    );
    return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err=error.response?.data?.message as string 
        return {
          message: err,
        };
      }
      return {
        message: "An unexpected error occurred",
      };
    }
  }
  async UploadFileApi(filename: string,codebase64: string,token:string,action :string,parent:string,version:number): Promise<FilesResponse|ErrorResponse> {
    try {
      const response = await Http.post<FilesResponse>("/user/upload-file", 
        {
        filename: filename,
        codebase64:codebase64,
        action:action,
        parent:parent,
        version:version
      },
      {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' +token
          }
        }
    );
    return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err=error.response?.data?.message as string 
        return {
          message: err,
        };
      }
      return {
        message: "An unexpected error occurred",
      };
    }
  }
}
