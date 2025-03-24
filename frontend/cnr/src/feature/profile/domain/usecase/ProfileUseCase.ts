import {
  ChildResponse,
  FolderResponse,
  InstitutionResponse,
  PhaseResponse,
  UsersResponse,
} from "./../../data/dtos/ProfileDtos";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileResponse } from "../../data/dtos/ProfileDtos";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async GetProfile(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse> {
    return await this.repository.GetProfile(token, permission);
  }

  async GetUsers(
    token: string,
    permission: string
  ): Promise<UsersResponse | ErrorResponse> {
    return await this.repository.GetUsers(token, permission);
  }

  async GetFolder(
    token: string,
    permission: string
  ): Promise<FolderResponse | ErrorResponse> {
    return await this.repository.GetFolder(token, permission);
  }

  async GetInstitutions(
    token: string,
    permission: string
  ): Promise<InstitutionResponse | ErrorResponse> {
    return await this.repository.GetInstituations(token, permission);
  }
  async GetChildOfInstitutions(
    id: string,
    name: string,
    token: string,
    permission: string
  ): Promise<ChildResponse | ErrorResponse> {
    return await this.repository.GetChildOfInstitutions(
      id,
      name,
      token,
      permission
    );
  }

  async GetCurrentPhase(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse> {
    return await this.repository.GetCurrentPhase(token, permission);
  }
}
