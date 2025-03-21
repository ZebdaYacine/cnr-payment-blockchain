import { NotificationResponse } from "../../../../core/dtos/data";
import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../../data/dtos/FolderDtos";

export interface FolderRepository {
  GetFolder(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse>;
  AddNotification(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    time: Date
  ): Promise<NotificationResponse | ErrorResponse>;
}
