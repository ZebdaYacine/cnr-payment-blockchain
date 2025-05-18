import { ErrorResponse } from "../../../../services/model/commun";
import { PKI1Response, HackingTryPKIResponse } from "../dtos/DashBoardDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface DashBoardDataSource {
  GetUploadingFilesPKIApi(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse>;

  GetHackingTryPKIApi(
    token: string,
    permission: string
  ): Promise<HackingTryPKIResponse | ErrorResponse>;
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

  async GetHackingTryPKIApi(
    token: string,
    permission: string
  ): Promise<HackingTryPKIResponse | ErrorResponse> {
    return ApiService.makeRequest<HackingTryPKIResponse>(
      "get",
      `/${permission}/get-hacking-try-pki`,
      token
    );
  }
}
