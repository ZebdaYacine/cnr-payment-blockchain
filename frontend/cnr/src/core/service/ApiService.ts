import { AxiosError } from "axios";
// import { ErrorResponse } from "../../services/model/commun";
import { Http } from "../../services/Http";

export class ApiService {
  private static getAuthHeaders(token: string) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Unknown error";

      let errorMessage = `Error ${status || "unknown"}: ${message}`;

      switch (status) {
        case 400:
          errorMessage = "Bad Request: " + message;
          break;
        case 401:
          errorMessage = "Unauthorized: Please log in again.";
          break;
        case 403:
          errorMessage =
            "Forbidden: You don't have permission to access this resource.";
          break;
        case 404:
          errorMessage = "Not Found: The requested resource was not found.";
          break;
        case 500:
          errorMessage = "Server Error: Something went wrong on the server.";
          break;
        case 502:
          errorMessage =
            "Bad Gateway: The server received an invalid response.";
          break;
        case 503:
          errorMessage =
            "Service Unavailable: The server is temporarily unavailable.";
          break;
        case 504:
          errorMessage =
            "Gateway Timeout: The request took too long to process.";
          break;
      }

      // console.error("❌ API Error:", errorMessage);
      throw new Error(errorMessage); // ✅ Throw the error instead of returning it
    }

    // console.error("❌ Unexpected API Error:", error);
    throw new Error("An unexpected error occurred.");
  }

  public static async makeRequest<T>(
    method: "get" | "post",
    url: string,
    token: string,
    data?: object,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      console.log(`🔍 API Request: ${method.toUpperCase()} ${url}`);
      console.log("🔑 Token used:", token);

      const config = {
        ...this.getAuthHeaders(token),
        params,
      };

      const response = await (method === "get"
        ? Http.get<T>(url, config)
        : Http.post<T>(url, data, config));

      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error) {
      ApiService.handleError(error); // ✅ Throws an error instead of returning an ErrorResponse
    }
  }

  public static async makeDownloadRequest(
    method: "get" | "post",
    url: string,
    token: string,
    data?: object,
    params?: Record<string, string>
  ): Promise<import("axios").AxiosResponse<Blob>> {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob" as const, 
        params,
      };

      const response = await (method === "get"
        ? Http.get<Blob>(url, config)
        : Http.post<Blob>(url, data, config));

      return response;
    } catch (error) {
      ApiService.handleError(error);
    }
  }
}
