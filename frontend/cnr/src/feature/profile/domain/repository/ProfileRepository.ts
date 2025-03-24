import { ErrorResponse } from "../../../../services/model/commun";
import {
  ChildResponse,
  FolderResponse,
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
  GetFolder(
    token: string,
    permission: string
  ): Promise<FolderResponse | ErrorResponse>;
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
}
