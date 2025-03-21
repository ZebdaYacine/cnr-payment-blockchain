import { ErrorResponse } from "../../../../services/model/commun";
import { NotificationResponse } from "../../data/dtos/NotificationDtos";

export interface NotificationRepository {
  GetNotification(
    token: string,
    permission: string
  ): Promise<NotificationResponse | ErrorResponse>;
  AddNotification(
    token: string,
    permission: string,
    receiverId: string[],
    senderId: string,
    message: string,
    title: string,
    time: Date
  ): Promise<NotificationResponse | ErrorResponse>;
}
