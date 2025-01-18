import { ErrorResponse, LoginResponse } from "../../../../services/model/login";

export interface AuthRepository {
  Login(username:string,password:string): Promise<LoginResponse|ErrorResponse>;
}