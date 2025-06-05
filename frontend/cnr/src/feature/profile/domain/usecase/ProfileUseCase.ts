import {
  ChildResponse,
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

  async GetAllUsers(
    token: string,
    permission: string
  ): Promise<UsersResponse | ErrorResponse> {
    return await this.repository.GetAllUsers(token, permission);
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

  async AddPk(
    token: string,
    permission: string,
    pk: string
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.AddPk(token, permission, pk);
  }

  async UpdateFirstLastName(
    token: string,
    permission: string,
    firstName: string,
    lastName: string,
    avatar: string | undefined
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.UpdateFirstLastName(
      token,
      permission,
      firstName,
      lastName,
      avatar
    );
  }

  async UpdatePassword(
    token: string,
    permission: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.UpdatePassword(
      token,
      permission,
      oldPassword,
      newPassword
    );
  }

  async SendOTP(
    token: string,
    // permission: string,
    email: string
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.SendOTP(token, email);
  }

  async ConfirmOTP(
    token: string,
    // permission: string,
    otp: string
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.ConfirmOTP(token, otp);
  }

  async VerifySignature(
    token: string,
    permission: string,
    signature: string,
    randomValue: string
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.VerifySignature(
      token,
      permission,
      signature,
      randomValue
    );
  }

  async UpdateUser(
    token: string,
    permission: string,
    userId: string,
    newType: string,
    status: boolean
  ): Promise<boolean | ErrorResponse> {
    return await this.repository.UpdateUser(
      token,
      permission,
      userId,
      newType,
      status
    );
  }
}
