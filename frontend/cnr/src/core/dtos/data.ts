export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  idInstituion: string;
  workAt: string;
  type: string;
  permission: string;
  wilaya: string;
}

export interface Folder {
  id: string;
  name: string;
  nbrItems: number;
  createAt: string;
  user: string;
}

export interface Notification {
  id: string;
  sender: string;
  receivers: string[];
  message: string;
  time: string;
}

export interface NotificationResponse {
  message: string;
  data: Notification[];
}
