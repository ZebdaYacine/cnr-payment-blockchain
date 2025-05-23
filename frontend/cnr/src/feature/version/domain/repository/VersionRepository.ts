import { ErrorResponse } from "../../../../services/model/commun";
import {
  VersionsResponse,
  VersionsUploadResponse,
} from "../../data/dtos/VersionsDtos";

export interface VersionRepository {
  GetVersions(
    token: string,
    permission: string,
    folder: string,
    parent: string
  ): Promise<VersionsResponse | ErrorResponse>;
  // GetProfile(token:string): Promise<ProfileResponse|ErrorResponse>;
  UploadVersions(
    filename: string,
    codebase64: string,
    token: string,
    action: string,
    parent: string,
    version: number,
    permission: string,
    commit: string,
    description: string,
    folderName: string,
    hash_parent: string,
    receiverId: string,
    taggedUsers: string[],
    organization: string,
    destination: string
  ): Promise<VersionsUploadResponse | ErrorResponse>;
}
