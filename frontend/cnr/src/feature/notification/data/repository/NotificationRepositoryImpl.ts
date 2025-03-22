import { ErrorResponse } from "../../../../services/model/commun";
import { NotificationRepository } from "../../domain/repository/NoificationRepository";
import { NotificationDataSource } from "../dataSource/NotificationAPIDataSource";
import { NotificationResponse } from "../dtos/NotificationDtos";

export class NotificationRepositoryImpl implements NotificationRepository {
  datasource: NotificationDataSource;

  constructor(datasource: NotificationDataSource) {
    this.datasource = datasource;
  }

  async GetNotification(
    token: string,
    permission: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return await this.datasource.GetNotificationApi(token, permission);
  }

  async AddNotification(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    title: string,
    time: Date,
    path: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return await this.datasource.AddNotificationApi(
      token,
      permission,
      receiverId,
      senderId,
      message,
      title,
      time,
      path
    );
  }
}
