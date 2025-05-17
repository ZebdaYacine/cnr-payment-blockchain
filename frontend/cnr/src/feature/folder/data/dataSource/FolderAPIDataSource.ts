import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../dtos/FolderDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface FolderDataSource {
  GetFolderApi(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse>;
}

export class FolderDataSourceImpl implements FolderDataSource {
  async GetFolderApi(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse> {
    return ApiService.makeRequest<FolderResponse>(
      "get",
      `/${permission}/get-folders`,
      token,
      undefined,
      {
        receiverId,
        senderId,
      }
    );
  }
}
