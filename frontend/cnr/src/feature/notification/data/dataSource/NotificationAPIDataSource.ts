import { ErrorResponse } from "../../../../services/model/commun";
import { ApiService } from "../../../../core/service/ApiService";
import { NotificationResponse } from "../dtos/NotificationDtos";

export interface NotificationDataSource {
  UpdateNotificationApi(
    token: string,
    permission: string,
    notificationId: string
  ): Promise<NotificationResponse | ErrorResponse>;

  GetNotificationApi(
    token: string,
    permission: string
  ): Promise<NotificationResponse | ErrorResponse>;
  AddNotificationApi(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    title: string,
    time: Date,
    path: string
  ): Promise<NotificationResponse | ErrorResponse>;
}

export class NotificationDataSourceImpl implements NotificationDataSource {
  AddNotificationApi(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    title: string,
    time: Date,
    path: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return ApiService.makeRequest<NotificationResponse>(
      "post",
      `/${permission}/add-notification`,
      token,
      {
        receiverId,
        senderId,
        message,
        title,
        time,
        path,
      }
    );
  }
  async GetNotificationApi(
    token: string,
    permission: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return ApiService.makeRequest<NotificationResponse>(
      "get",
      `/${permission}/get-notifications`,
      token
    );
  }

  async UpdateNotificationApi(
    token: string,
    permission: string,
    id: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return ApiService.makeRequest<NotificationResponse>(
      "post",
      `/${permission}/update-notification`,
      token,
      {
        id,
      }
    );
  }
}
