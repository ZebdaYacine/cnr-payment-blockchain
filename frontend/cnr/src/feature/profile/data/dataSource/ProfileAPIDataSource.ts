import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import { ErrorResponse } from "../../../../services/model/commun";
import { ChildResponse, FileResponse, FilesResponse, InstitutionResponse, ProfileResponse } from "../dtos/ProfileDtos";

export interface ProfileDataSource {
  GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse>;
  GetFilesApi(token: string): Promise<FilesResponse | ErrorResponse>;
  UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    version: number
  ): Promise<FileResponse | ErrorResponse>;
  GetInstituaionApi(token: string): Promise<InstitutionResponse | ErrorResponse>;
  GetChildOfInstitutionsApi(id:string,name:string,token: string): Promise<ChildResponse | ErrorResponse>;


}

export class ProfileDataSourceImpl implements ProfileDataSource {
 
  private getAuthHeaders(token: string) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private handleError(error: unknown): ErrorResponse {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || "Unknown error";
        switch (status) {
            case 400:
                return { message: "Bad Request: " + message };
            case 401:
                return { message: "Unauthorized: Please log in again." };
            case 403:
                return { message: "Forbidden: You don't have permission to access this resource." };
            case 404:
                return { message: "Not Found: The requested resource was not found." };
            case 500:
                return { message: "Server Error: Something went wrong on the server." };
            case 502:
                return { message: "Bad Gateway: The server received an invalid response." };
            case 503:
                return { message: "Service Unavailable: The server is temporarily unavailable." };
            case 504:
                return { message: "Gateway Timeout: The request took too long to process." };
            default:
                return { message: `Error ${status || "unknown"}: ${message}` };
        }
    }

    return { message: "An unexpected error occurred." };
}

  private async makeRequest<T>(method: "get" | "post", url: string, token: string, data?: object): Promise<T | ErrorResponse> {
    try {
      const response = await (method === "get"
        ? Http.get<T>(url, this.getAuthHeaders(token))
        : Http.post<T>(url, data, this.getAuthHeaders(token)));

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async GetProfileApi(token: string): Promise<ProfileResponse | ErrorResponse> {
    return this.makeRequest<ProfileResponse>("get", "/user/get-profile", token);
  }

  async GetFilesApi(token: string): Promise<FilesResponse | ErrorResponse> {
    return this.makeRequest<FilesResponse>("get", "/user/get-all-files-metadata", token);
  }

  GetInstituaionApi(token: string): Promise<InstitutionResponse | ErrorResponse> {
    return this.makeRequest<InstitutionResponse>("get", "/user/get-institutions", token);
  }

  GetChildOfInstitutionsApi(id:string,name:string,token: string): Promise<ChildResponse | ErrorResponse> {
    return this.makeRequest<ChildResponse>("get", "/user/get-child-institutions?id="+id+"&workAt="+name,token); 
  }
  

  async UploadFileApi(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    version: number
  ): Promise<FileResponse | ErrorResponse> {
    return this.makeRequest<FileResponse>("post", "/user/upload-file", token, {
      filename,
      codebase64,
      action,
      parent,
      version,
    });
  }
}
