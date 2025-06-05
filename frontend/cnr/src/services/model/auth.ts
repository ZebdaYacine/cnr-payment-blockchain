export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserData {
  ID: string;
  id: string;
  email: string;
  password: string;
  username: string;
  idInstituion: string;
  workAt: string;
  type: string;
  permission: string;
  wilaya: string;
  phases: unknown;
  publicKey: string;
  createAt: string;
  last_name: string;
  first_name: string;
  avatar: string;
  status: boolean;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    userdata: UserData;
  };
}

export interface ErrorResponse {
  message: string;
}
