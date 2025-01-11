
export interface AuthRepository {
  Login(username:string,password:string): Promise<string>;
}