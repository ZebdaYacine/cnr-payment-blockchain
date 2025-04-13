import { AxiosError } from "axios";
import { Http } from "../../../../services/Http";
import { LoginResponse } from "../../../../services/model/auth";
import { ErrorResponse } from "../../../../services/model/commun";

export interface AuthDataSource {
  Login(
    username: string,
    password: string
  ): Promise<LoginResponse | ErrorResponse>;
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
          email,
          password,
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
        if (!error.response) {
          return {
            message:
              "Le serveur est inaccessible. Veuillez vérifier votre connexion Internet ou réessayer ultérieurement. ",
          };
        }

        return {
          message: error.response.data?.message,
        };
      }

      return {
        message: "An unexpected error occurred",
      };
    }
  }
}
