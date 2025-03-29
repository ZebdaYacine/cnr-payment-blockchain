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
  createAt: string;
  phases: string[];
  last_name: string;
  first_name: string;
}

export interface Folder {
  id: string;
  name: string;
  nbrItems: number;
  createAt: string;
  user: string;
}
