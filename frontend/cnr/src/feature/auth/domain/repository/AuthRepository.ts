import { LoginResponse, ErrorResponse } from "../../../../services/model/auth";

export interface AuthRepository {
  Login(
    username: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse>;
  Register(
    fname: string,
    lname: string,
    email: string,
    password: string,
    org: string,
    wilaya: string
  ): Promise<LoginResponse | ErrorResponse>;
  ForgetPassword(email: string): Promise<LoginResponse | ErrorResponse>;
}
