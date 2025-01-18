export interface LoginRequest {
  username: string;
  password: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface Data {
  token: string;
  userdata: UserData | null;
}

export interface LoginResponse {
  message: string;
  data: Data ;
}

export interface ErrorResponse {
  message: string;
}
