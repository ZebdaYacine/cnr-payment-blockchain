import { PhaseResponse, UsersResponse } from "./../dtos/ProfileDtos";
import { ErrorResponse } from "../../../../services/model/commun";
import { ProfileRepository } from "../../domain/repository/ProfileRepository";
import { ProfileDataSource } from "../dataSource/ProfileAPIDataSource";
import {
  ChildResponse,
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

  async GetCurrentPhase(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse> {
    return await this.datasource.GetCurrentPhaseApi(token, permission);
  }

  async AddPk(
    token: string,
    permission: string,
    pk: string
  ): Promise<boolean | ErrorResponse> {
    return await this.datasource.AddPKApi(token, permission, pk);
  }

  async UpdateFirstLastName(
    token: string,
    permission: string,
    firstName: string,
    lastName: string,
    avatar: string | undefined
  ): Promise<boolean | ErrorResponse> {
    return await this.datasource.UpdateFirstLastNameApi(
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
    return await this.datasource.UpdatePasswordApi(
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
    return await this.datasource.SendOTPApi(token, email);
  }

  async ConfirmOTP(
    token: string,
    // permission: string,
    otp: string
  ): Promise<boolean | ErrorResponse> {
    return await this.datasource.ConfirmOTPApi(token, otp);
  }

  async VerifySignature(
    token: string,
    permission: string,
    signature: string,
    randomValue: string
  ): Promise<boolean | ErrorResponse> {
    return await this.datasource.VerifySignatureApi(
      token,
      permission,
      signature,
      randomValue
    );
  }
}
