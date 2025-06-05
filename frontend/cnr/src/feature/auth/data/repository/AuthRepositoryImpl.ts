import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { AuthRepository } from "../../domain/Repositories/AuthRepository";
import { AuthDataSource } from "../dataSource/AuthAPIDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  datasource: AuthDataSource;

  constructor(datasource: AuthDataSource) {
    this.datasource = datasource;
  }

  async Login(
    email: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse> {
    return await this.datasource.Login(email, password);
  }

  async Register(
    fname: string,
    lname: string,
    email: string,
    password: string,
    org: string,
    wilaya: string
  ): Promise<LoginResponse | ErrorResponse> {
    return await this.datasource.Register(
      fname,
      lname,
      email,
      password,
      org,
      wilaya
    );
  }

  async ForgetPassword(email: string): Promise<LoginResponse | ErrorResponse> {
    return await this.datasource.ForgetPassword(email);
  }
}
