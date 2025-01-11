import { Http } from "../../../../Services/Http";

export interface AuthDataSource {
  Login(username:string,password:string): Promise<string>;
}

export class AuthDataSourceImpl implements AuthDataSource {
   async Login(username: string, password: string): Promise<string> {
    const response = await Http.post("/login", { 
      "email":username,
      "password":password
     });
    return response.data as string; 
  }
}