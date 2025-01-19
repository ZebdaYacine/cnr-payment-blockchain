import { UploadResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface ProfileRepository {
  UploadFile(file : string): Promise<UploadResponse|ErrorResponse>;
}