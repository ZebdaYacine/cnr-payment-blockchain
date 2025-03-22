import { User } from "../../../../core/dtos/data";

export interface Notification {
  id: string;
  sender: string;
  receivers: string[];
  message: string;
  time: string;
  title: string;
  Sender: User;
  path: string;
}

export interface NotificationResponse {
  message: string;
  data: Notification[];
}
