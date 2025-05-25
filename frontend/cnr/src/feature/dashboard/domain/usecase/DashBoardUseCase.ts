import { DashBoardRepository } from "./../repository/DashBoardRepository";
import { ErrorResponse } from "../../../../services/model/commun";
import {
  PKI1Response,
  HackingTryPKIResponse,
  WorkersErrorRatePKIResponse,
} from "../../data/dtos/DashBoardDtos";

export class DashBoardUseCase {
  repository: DashBoardRepository;

  constructor(repository: DashBoardRepository) {
    this.repository = repository;
  }

  async GetUplaodFilesPKI(
    token: string,
    permission: string
  ): Promise<PKI1Response | ErrorResponse> {
    return await this.repository.GetUplaodFilesPKI(token, permission);
  }

  async HackingTryPKI(
    token: string,
    permission: string
  ): Promise<HackingTryPKIResponse | ErrorResponse> {
    return await this.repository.GetHackingTryPKI(token, permission);
  }

  async GetWorkersErrorRatePKI(
    token: string,
    permission: string
  ): Promise<WorkersErrorRatePKIResponse | ErrorResponse> {
    return await this.repository.GetWorkersErrorRatePKI(token, permission);
  }
}
