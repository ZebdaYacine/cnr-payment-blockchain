import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import {  UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface ProfileDataSource {
  UploadFileApi(filename: string,codebase64: string,token:string): Promise<UploadResponse|ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
  async UploadFileApi(filename: string,codebase64: string,token:string): Promise<UploadResponse|ErrorResponse> {
    try {
      const response = await Http.post<UploadResponse>("/user/upload-file", 
        {
        filename: filename,
        codebase64:codebase64
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
