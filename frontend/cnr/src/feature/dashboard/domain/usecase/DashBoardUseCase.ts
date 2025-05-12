import { DashBoardRepository } from "./../repository/DashBoardRepository";
import { ErrorResponse } from "../../../../services/model/commun";
import { PKI1Response } from "../../data/dtos/DashBoardDtos";

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
}
