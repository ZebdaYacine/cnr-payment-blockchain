import { Http } from "../../../../services/Http";
import {  ErrorResponse, LoginResponse } from "../../../../services/model/login";

export interface AuthDataSource {
  Login(username: string, password: string): Promise<LoginResponse|ErrorResponse>;
}

export class AuthDataSourceImpl implements AuthDataSource {
  async Login(username: string, password: string): Promise<LoginResponse|ErrorResponse> {
    try {
      const response = await Http.post<LoginResponse>("/login", {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      console.log("Network error", error); 
      return {
        message: "Network error"+error,
      };
    }
  }
}
