export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  idInstituion: string;
  workAt: string;
  type:string;
  permission: string,
  wilaya: string,
}

export interface Folder {
  name: string;
  nbrItems: number;
  createAt: string; 
  user:string
}
