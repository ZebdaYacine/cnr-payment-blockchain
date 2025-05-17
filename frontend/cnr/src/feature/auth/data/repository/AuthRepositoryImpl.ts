import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { AuthRepository } from "../../domain/Repositories/AuthRepository";
import { AuthDataSource } from "../dataSource/AuthAPIDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  datasource: AuthDataSource;

  constructor(datasource: AuthDataSource) {
    this.datasource = datasource;
  }

  async Login(email: string, password: string): Promise<LoginResponse|ErrorResponse> {
    return await this.datasource.Login(email, password);
  }
}
