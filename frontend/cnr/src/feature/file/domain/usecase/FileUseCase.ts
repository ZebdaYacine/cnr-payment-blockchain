import {  FileResponse } from '../../data/dtos/FileDtos';
import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse } from "../../data/dtos/FileDtos";
import { FileRepository } from "../repository/FileRepository";

export class FileUseCase {
  repository: FileRepository;

  constructor(repository: FileRepository) {
    this.repository = repository;
  }

  async UploadFile(
    permission: string,
    filename: string,
    codebase64: string,
    token:string,action :string,
    parent:string,
    folder:string,
    description:string,
    version:number): 
    Promise<FileResponse|ErrorResponse> {
    return await this.repository.UploadFile(
      permission,
      filename,
      codebase64,
      token,action,
      parent,
      folder,
      description,
      version);
  }

  async GetFiles(permission: string,token:string,folder:string): Promise<FilesResponse|ErrorResponse> {
      return await  this.repository.GetFiles(permission,token,folder);
  }

}
