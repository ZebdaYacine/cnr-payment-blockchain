import { ChildResponse, FileResponse, FolderResponse, InstitutionResponse, UsersResponse } from './../../data/dtos/ProfileDtos';
import { ErrorResponse } from "../../../../services/model/commun";
import { FilesResponse, ProfileResponse } from "../../data/dtos/ProfileDtos";
import { ProfileRepository } from "../repository/ProfileRepository";

export class PofileUseCase {
  repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  async UploadFile(
    filename: string,
    codebase64: string,
    token:string,action :string,
    parent:string,
    folder:string,
    description:string,
    version:number): 
    Promise<FileResponse|ErrorResponse> {
    return await this.repository.UploadFile(
      filename,
      codebase64,
      token,action,
      parent,
      folder,
      description,
      version);
  }

  async GetFiles(token:string): Promise<FilesResponse|ErrorResponse> {
      return await  this.repository.GetFiles(token);
  }

  async GetProfile(token:string): Promise<ProfileResponse|ErrorResponse> {
      return await  this.repository.GetProfile(token);
  }

  async GetUsers(token:string): Promise<UsersResponse|ErrorResponse> {
      return await  this.repository.GetUsers(token);
  }

  async GetFolder(token:string): Promise<FolderResponse|ErrorResponse> {
      return await  this.repository.GetFolder(token);
  }

  async GetInstitutions(token:string): Promise<InstitutionResponse|ErrorResponse> {
      return await  this.repository.GetInstituations(token);
  }
  async GetChildOfInstitutions(id:string,name:string,token:string): Promise<ChildResponse|ErrorResponse> {
      return await  this.repository.GetChildOfInstitutions(id,name,token);
  }
}
