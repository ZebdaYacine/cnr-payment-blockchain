import {
  ChildResponse,
  FileResponse,
  FolderResponse,
  InstitutionResponse,
  PhaseResponse,
  UsersResponse,
} from "./../../data/dtos/ProfileDtos";
import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse, ProfileResponse } from "../../data/dtos/ProfileDtos";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async UploadFile(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    folder: string,
    description: string,
    organisation: string,
    destination: string,
    version: number,
    permission: string,
    reciverId: string,
    tagged_users: string[],
    phase: string
  ): Promise<FileResponse | ErrorResponse> {
    return await this.repository.UploadFile(
      filename,
      codebase64,
      token,
      action,
      parent,
      folder,
      description,
      organisation,
      destination,
      version,
      permission,
      reciverId,
      tagged_users,
      phase
    );
  }

  async GetFiles(
    token: string,
    permission: string
  ): Promise<FilesResponse | ErrorResponse> {
    return await this.repository.GetFiles(token, permission);
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
