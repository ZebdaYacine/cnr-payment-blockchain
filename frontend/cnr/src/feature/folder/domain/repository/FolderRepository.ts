import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../../data/dtos/FolderDtos";

export interface FolderRepository {
  GetFolder(token:string): Promise<FolderResponse|ErrorResponse>;
}