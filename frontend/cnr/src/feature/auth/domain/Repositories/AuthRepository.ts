import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface AuthRepository {
  Login(email:string,password:string): Promise<LoginResponse|ErrorResponse>;
}