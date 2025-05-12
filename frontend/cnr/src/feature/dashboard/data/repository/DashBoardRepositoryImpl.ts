import { ErrorResponse } from "../../../../services/model/commun";
import { DashBoardRepository } from "../../domain/repository/DashBoardRepository";
import { DashBoardDataSource } from "../dataSource/DashBoardAPIDataSource";
import { PKI1Response } from "../dtos/DashBoardDtos";

export class DashBoardRepositoryImpl implements DashBoardRepository {
  datasource: DashBoardDataSource;

  constructor(datasource: DashBoardDataSource) {
    this.datasource = datasource;
  }

  async GetUplaodFilesPKI(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse> {
    return await this.datasource.GetUploadingFilesPKIApi(token, permission);
  }
}
