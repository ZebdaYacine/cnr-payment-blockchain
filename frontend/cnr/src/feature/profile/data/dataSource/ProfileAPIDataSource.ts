import { ErrorResponse } from "../../../../services/model/commun";
import {
  ChildResponse,
  InstitutionResponse,
  PhaseResponse,
  ProfileResponse,
  UsersResponse,
} from "../dtos/ProfileDtos";
import { ApiService } from "../../../../core/service/ApiService";

export interface ProfileDataSource {
  GetProfileApi(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse>;
  GetUsersApi(
    token: string,
    permission: string
  ): Promise<UsersResponse | ErrorResponse>;

  GetCurrentPhaseApi(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse>;

  GetInstituaionApi(
    token: string,
    permission: string
  ): Promise<InstitutionResponse | ErrorResponse>;
  GetChildOfInstitutionsApi(
    id: string,
    name: string,
    token: string,
    permission: string
  ): Promise<ChildResponse | ErrorResponse>;
  AddPKApi(
    token: string,
    permission: string,
    Pk: string
  ): Promise<boolean | ErrorResponse>;
  UpdateFirstLastNameApi(
    token: string,
    permission: string,
    firstName: string,
    lastName: string,
    avatar: string | undefined
  ): Promise<boolean | ErrorResponse>;
  UpdatePasswordApi(
    token: string,
    permission: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | ErrorResponse>;
  SendOTPApi(
    token: string,
    // permission: string,
    email: string
  ): Promise<boolean | ErrorResponse>;
  ConfirmOTPApi(
    token: string,
    // permission: string,
    otp: string
  ): Promise<boolean | ErrorResponse>;
  VerifySignatureApi(
    token: string,
    permission: string,
    signature: string,
    randomValue: string
  ): Promise<boolean | ErrorResponse>;
}

export class ProfileDataSourceImpl implements ProfileDataSource {
  async AddPKApi(
    token: string,
    permission: string,
    pk: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/${permission}/add-pk`,
        token,
        { pk }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
  GetCurrentPhaseApi(
    token: string,
    permission: string
  ): Promise<PhaseResponse | ErrorResponse> {
    return ApiService.makeRequest<PhaseResponse>(
      "get",
      `/${permission}/get-current-phase`,
      token
    );
  }
  async GetProfileApi(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse> {
    return ApiService.makeRequest<ProfileResponse>(
      "get",
      `/${permission}/get-profile`,
      token
    );
  }

  async GetUsersApi(
    token: string,
    permission: string
  ): Promise<ProfileResponse | ErrorResponse> {
    return ApiService.makeRequest<ProfileResponse>(
      "get",
      `/${permission}/bring-users`,
      token
    );
  }

  GetInstituaionApi(
    token: string,
    permission: string
  ): Promise<InstitutionResponse | ErrorResponse> {
    return ApiService.makeRequest<InstitutionResponse>(
      "get",
      `/${permission}/get-institutions`,
      token
    );
  }

  GetChildOfInstitutionsApi(
    id: string,
    name: string,
    token: string,
    permission: string
  ): Promise<ChildResponse | ErrorResponse> {
    return ApiService.makeRequest<ChildResponse>(
      "get",
      `/${permission}/get-child-institutions?id=${id}&workAt=${name}`,
      token
    );
  }

  async UpdateFirstLastNameApi(
    token: string,
    permission: string,
    first_name: string,
    last_name: string,
    avatar: string | undefined
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/${permission}/update-name`,
        token,
        { firstName: first_name, lastName: last_name, avatar: avatar }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async UpdatePasswordApi(
    token: string,
    permission: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/${permission}/update-password`,
        token,
        { oldPassword, newPassword }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async SendOTPApi(
    token: string,
    // permission: string,
    email: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/set-email`,
        token,
        { email }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async ConfirmOTPApi(
    token: string,
    // permission: string,
    otp: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/confirm-otp`,
        token,
        { otp }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async VerifySignatureApi(
    token: string,
    permission: string,
    signature: string,
    randomValue: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const response = await ApiService.makeRequest<boolean>(
        "post",
        `/${permission}/verify-signature`,
        token,
        { signature, randomValue }
      );
      return response;
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
