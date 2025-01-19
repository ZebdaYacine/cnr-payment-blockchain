import { UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";

export class ProfileRepositoryImpl implements ProfileRepository {
  datasource: ProfileDataSource;

  constructor(datasource: ProfileDataSource) {
    this.datasource = datasource;
  }

  async UploadFile(file: string): Promise<UploadResponse|ErrorResponse> {
    return await this.datasource.UploadFileApi(file);
  }
}
