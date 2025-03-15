import { ErrorResponse } from "../../../../services/model/commun";
import { FolderRepository } from "../../domain/repository/FolderRepository";
import { FolderDataSource } from "../dataSource/FolderAPIDataSource";
import { FolderResponse } from "../dtos/FolderDtos";

export class FolderRepositoryImpl implements FolderRepository {
  datasource: FolderDataSource;

  constructor(datasource: FolderDataSource) {
    this.datasource = datasource; 
  }

  async GetFolder(token:string,permission: string,organisation:string,destination:string): Promise<FolderResponse | ErrorResponse> {
    return await this.datasource.GetFolderApi(token,permission,organisation,destination);
  }
  
}
