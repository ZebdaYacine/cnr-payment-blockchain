import { ErrorResponse } from "../../../../services/model/commun";
import { NotificationResponse } from "../../data/dtos/NotificationDtos";
import { NotificationRepository } from "../repository/NoificationRepository";

export class NotificationUseCase {
  repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async GetNotifications(
    token: string,
    permission: string
  ): Promise<NotificationRepository | ErrorResponse> {
    return await this.repository.GetNotification(token, permission);
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
    return await this.repository.AddNotification(
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

  async UpdateNotification(
    token: string,
    permission: string,
    notificationId: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return await this.repository.UpdateNotification(
      token,
      permission,
      notificationId
    );
  }
}
