export interface Notification {
  id: string;
  sender: string;
  receivers: string[];
  message: string;
  time: string;
  title: string;
}

export interface NotificationResponse {
  message: string;
  data: Notification[];
}
