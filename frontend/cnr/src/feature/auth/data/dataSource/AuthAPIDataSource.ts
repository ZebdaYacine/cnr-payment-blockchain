import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface AuthDataSource {
  Login(
    username: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse>;
  Register(
    fname: string,
    lname: string,
    email: string,
    password: string,
    org: string,
    wilaya: string
  ): Promise<LoginResponse | ErrorResponse>;
  ForgetPassword(email: string): Promise<LoginResponse | ErrorResponse>;
}

export class AuthDataSourceImpl implements AuthDataSource {
  async Login(
    email: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse> {
    try {
      const response = await Http.post<LoginResponse>(
        "/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data?.message as string;
        return {
          message: err,
        };
      }
      return {
        message: "An unexpected error occurred",
      };
    }
  }

  async Register(
    fname: string,
    lname: string,
    email: string,
    password: string,
    org: string,
    wilaya: string
  ): Promise<LoginResponse | ErrorResponse> {
    try {
      const response = await Http.post<LoginResponse>(
        "/create-account",
        {
          f_name: fname,
          l_name: lname,
          email: email,
          password: password,
          org: org,
          wilaya: wilaya,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data?.message as string;
        return {
          message: err,
        };
      }
      return {
        message: "An unexpected error occurred",
      };
    }
  }

  async ForgetPassword(email: string): Promise<LoginResponse | ErrorResponse> {
    try {
      const response = await Http.post<LoginResponse>(
        "/forgot-password",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data?.message as string;
        return {
          message: err,
        };
      }
      return {
        message: "An unexpected error occurred",
      };
    }
  }
}
