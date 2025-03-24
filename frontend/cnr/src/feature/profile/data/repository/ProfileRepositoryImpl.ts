import { PhaseResponse, UsersResponse } from "./../dtos/ProfileDtos";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";
import {
  ChildResponse,
  FileResponse,
  FilesResponse,
  FolderResponse,
  InstitutionResponse,
  ProfileResponse,
} from "../dtos/ProfileDtos";

export class ProfileRepositoryImpl implements ProfileRepository {
  datasource: ProfileDataSource;

  constructor(datasource: ProfileDataSource) {
    this.datasource = datasource;
  }
  async GetChildOfInstitutions(
    id: string,
    name: string,
    token: string,
    permission: string
  ): Promise<ChildResponse | ErrorResponse> {
    return await this.datasource.GetChildOfInstitutionsApi(
      id,
      name,
      token,
      permission
    );
  }
  async GetInstituations(
    token: string,
    permission: string
  ): Promise<InstitutionResponse | ErrorResponse> {
    return await this.datasource.GetInstituaionApi(token, permission);
  }
  async GetProfile(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse> {
    return await this.datasource.GetProfileApi(token, permission);
  }

  async GetUsers(
    token: string,
    permission: string
  ): Promise<UsersResponse | ErrorResponse> {
    return await this.datasource.GetUsersApi(token, permission);
  }

  async GetFolder(
    token: string,
    permission: string
  ): Promise<FolderResponse | ErrorResponse> {
    return await this.datasource.GetFolderApi(token, permission);
  }
  async GetFiles(
    token: string,
    permission: string
  ): Promise<FilesResponse | ErrorResponse> {
    return await this.datasource.GetFilesApi(token, permission);
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
    return await this.datasource.UploadFileApi(
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

  async GetCurrentPhase(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse> {
    return await this.datasource.GetCurrentPhaseApi(token, permission);
  }
}
