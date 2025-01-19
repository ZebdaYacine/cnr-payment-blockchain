import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import {  UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface ProfileDataSource {
  UploadFileApi(file:string): Promise<UploadResponse|ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
  async UploadFileApi(file: string): Promise<UploadResponse|ErrorResponse> {
    try {
      const response = await Http.post<UploadResponse>("/upload", 
        {
        file: file,
      },
      {
          headers: {
            'Content-Type': 'application/json',
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
