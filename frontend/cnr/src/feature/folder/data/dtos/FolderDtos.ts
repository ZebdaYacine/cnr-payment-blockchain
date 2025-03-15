



export interface FolderResponse {
  message: string;
  data: Folder[] ;
}



export interface Folder {
  name: string;
  nbrItems: number;
  createAt: string; 
  user:string
}




