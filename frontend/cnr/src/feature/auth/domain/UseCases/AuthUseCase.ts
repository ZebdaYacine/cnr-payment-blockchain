import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { AuthRepository } from "../Repositories/AuthRepository";

export class AuthUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async login(
    username: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse> {
    return await this.repository.Login(username, password);
  }

  async register(
    fname: string,
    lname: string,
    email: string,
    password: string,
    org: string,
    wilaya: string
  ): Promise<LoginResponse | ErrorResponse> {
    return await this.repository.Register(
      fname,
      lname,
      email,
      password,
      org,
      wilaya
    );
  }

  async forgetPassword(email: string): Promise<LoginResponse | ErrorResponse> {
    return await this.repository.ForgetPassword(email);
  }
}
