import { ErrorResponse } from "../../../../services/model/commun";
import { PKI1Response } from "../dtos/DashBoardDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface DashBoardDataSource {
  GetUploadingFilesPKIApi(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse>;
}

export class DashBoardDataSourceImpl implements DashBoardDataSource {
  async GetUploadingFilesPKIApi(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse> {
    return ApiService.makeRequest<PKI1Response>(
      "get",
      `/${permission}/get-PKI1`,
      token
    );
  }
}
