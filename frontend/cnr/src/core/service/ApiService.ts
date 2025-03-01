import  { AxiosError } from "axios";
import { ErrorResponse } from "../../services/model/commun";
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

private static handleError(error: unknown): ErrorResponse {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Unknown error";

       switch (status) {
            case 400:
                return { message: "Bad Request: " + message };
            case 401:
                return { message: "Unauthorized: Please log in again." };
            case 403:
                return { message: "Forbidden: You don't have permission to access this resource." };
            case 404:
                return { message: "Not Found: The requested resource was not found." };
            case 500:
                return { message: "Server Error: Something went wrong on the server." };
            case 502:
                return { message: "Bad Gateway: The server received an invalid response." };
            case 503:
                return { message: "Service Unavailable: The server is temporarily unavailable." };
            case 504:
                return { message: "Gateway Timeout: The request took too long to process." };
            default:
                return { message: `Error ${status || "unknown"}: ${message}` };
        }
    }

    return { message: "An unexpected error occurred." };
  }

 public static async makeRequest<T>(
  method: "get" | "post",
  url: string,
  token: string,
  data?: object
): Promise<T | ErrorResponse> {
  try {

    console.log(`🔍 API Request: ${method.toUpperCase()} ${url}`); // Log API call
    console.log("🔑 Token used:", token);

    const response = await (method === "get"
        ? Http.get<T>(url, this.getAuthHeaders(token))
        : Http.post<T>(url, data, this.getAuthHeaders(token)));

    console.log("✅ API Response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error);
    return ApiService.handleError(error);
  }
}


}
