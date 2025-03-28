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
  publicKey: string;
  CreateAt: string;
  phases: string[];
}

export interface Folder {
  id: string;
  name: string;
  nbrItems: number;
  createAt: string;
  user: string;
}
