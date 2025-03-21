import { NotificationResponse } from "../../../../core/dtos/data";
import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../../data/dtos/FolderDtos";
import { FolderRepository } from "../repository/FolderRepository";

export class FolderUseCase {
  repository: FolderRepository;

  constructor(repository: FolderRepository) {
    this.repository = repository;
  }

  async GetFolder(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse> {
    return await this.repository.GetFolder(
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
    time: string
  ): Promise<NotificationResponse | ErrorResponse> {
    return await this.repository.AddNotification(
      token,
      permission,
      receiverId,
      senderId,
      message,
      time
    );
  }
}
