import { UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface ProfileRepository {
  UploadFile(filename: string,codebase64: string): Promise<UploadResponse|ErrorResponse>;
}