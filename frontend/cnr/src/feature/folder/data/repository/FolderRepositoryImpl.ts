import { NotificationResponse } from "../../../../core/dtos/data";
import { ErrorResponse } from "../../../../services/model/commun";
import { FolderRepository } from "../../domain/repository/FolderRepository";
import { FolderDataSource } from "../dataSource/FolderAPIDataSource";
import { FolderResponse } from "../dtos/FolderDtos";

export class FolderRepositoryImpl implements FolderRepository {
  datasource: FolderDataSource;

  constructor(datasource: FolderDataSource) {
    this.datasource = datasource;
  }

  async GetFolder(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse> {
    return await this.datasource.GetFolderApi(
      token,
      permission,
      receiverId,
      senderId
    );
  }

  async AddNotification(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    time: Date
  ): Promise<NotificationResponse | ErrorResponse> {
    return await this.datasource.AddNotificationApi(
      token,
      permission,
      receiverId,
      senderId,
      message,
      time
    );
  }
}
