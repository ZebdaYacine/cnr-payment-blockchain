import { ErrorResponse, LoginResponse } from "../../../../services/model/login";
import { AuthRepository } from "../../domain/Repositories/AuthRepository";
import { AuthDataSource } from "../dataSource/AuthAPIDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  datasource: AuthDataSource;

  constructor(datasource: AuthDataSource) {
    this.datasource = datasource;
  }

  async Login(username: string, password: string): Promise<LoginResponse|ErrorResponse> {
    return await this.datasource.Login(username, password);
  }
}
