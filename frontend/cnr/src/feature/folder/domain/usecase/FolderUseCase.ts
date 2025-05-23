import { ErrorResponse } from "../../../../services/model/commun";
import { FolderResponse } from "../../data/dtos/FolderDtos";
import { FolderRepository } from "../repository/FolderRepository";

export class FolderUseCase {
  repository: FolderRepository;

  constructor(repository: FolderRepository) {
    this.repository = repository;
  }

  async GetFolder(
    token: string,
    permission: string,
    receiverId: string,
    senderId: string
  ): Promise<FolderResponse | ErrorResponse> {
    return await this.repository.GetFolder(
      token,
      permission,
      receiverId,
      senderId
    );
  }
}
