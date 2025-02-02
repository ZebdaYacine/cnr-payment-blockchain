export interface LoginRequest {
  username: string;
  password: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  permission: string;
}

export interface Data {
  token: string;
  userdata: UserData | null;
}

export interface LoginResponse {
  message: string;
  data: Data ;
}




