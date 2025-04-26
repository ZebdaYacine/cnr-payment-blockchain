import { ErrorResponse } from "../../../../services/model/commun";
import {
  ChildResponse,
  InstitutionResponse,
  PhaseResponse,
  ProfileResponse,
  UsersResponse,
} from "../../data/dtos/ProfileDtos";

export interface ProfileRepository {
  GetProfile(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse>;

  GetUsers(
    token: string,
    permission: string
  ): Promise<UsersResponse | ErrorResponse>;

  GetInstituations(
    token: string,
    permission: string
  ): Promise<InstitutionResponse | ErrorResponse>;
  GetChildOfInstitutions(
    id: string,
    name: string,
    token: string,
    permission: string
  ): Promise<ChildResponse | ErrorResponse>;
  GetCurrentPhase(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse>;

  AddPk(
    token: string,
    permission: string,
    pk: string
  ): Promise<boolean | ErrorResponse>;

  UpdateFirstLastName(
    token: string,
    permission: string,
    firstName: string,
    lastName: string,
    avatar: string | undefined
  ): Promise<boolean | ErrorResponse>;

  UpdatePassword(
    token: string,
    permission: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | ErrorResponse>;

  SendOTP(
    token: string,
    permission: string,
    email: string
  ): Promise<boolean | ErrorResponse>;

  ConfirmOTP(
    token: string,
    permission: string,
    otp: string
  ): Promise<boolean | ErrorResponse>;

  VerifySignature(
    token: string,
    permission: string,
    signature: string,
    randomValue: string
  ): Promise<boolean | ErrorResponse>;
}
