import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../dtos/FolderDtos";
import { ApiService } from "../../../../core/service/ApiService";
import { NotificationResponse } from "../../../../core/dtos/data";

export interface FolderDataSource {
  GetFolderApi(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse>;
  AddNotificationApi(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    time: string
  ): Promise<NotificationResponse | ErrorResponse>;
}

export class FolderDataSourceImpl implements FolderDataSource {
  AddNotificationApi(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    time: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return ApiService.makeRequest<FolderResponse>(
      "post",
      `/${permission}/add-notification`,
      token,
      {
        receiverId,
        senderId,
        message,
        time,
      }
    );
  }
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
