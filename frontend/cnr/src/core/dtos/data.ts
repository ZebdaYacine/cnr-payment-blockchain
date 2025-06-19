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
  privateKey: string;
  createAt: string;
  phases: Pahse[];
  last_name: string;
  first_name: string;
  avatar: string;
  status?: boolean;
}
interface Pahse {
  id: string;
  is_sender?: boolean;
}
export interface Folder {
  id: string;
  name: string;
  nbrItems: number;
  createAt: string;
  user: string;
}
