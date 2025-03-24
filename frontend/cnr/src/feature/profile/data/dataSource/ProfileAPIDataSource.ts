import { ErrorResponse } from "../../../../services/model/commun";
import {
  ChildResponse,
  FolderResponse,
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
 
  GetFolderApi(
    token: string,
    permission: string
  ): Promise<FolderResponse | ErrorResponse>;
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
}

export class ProfileDataSourceImpl implements ProfileDataSource {
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

  async GetFolderApi(
    token: string,
    permission: string
  ): Promise<FolderResponse | ErrorResponse> {
    return ApiService.makeRequest<FolderResponse>(
      "get",
      `/${permission}/get-folders`,
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

 
}
