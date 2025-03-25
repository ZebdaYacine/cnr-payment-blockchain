import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "https://192.168.1.8:3000",
});

type HTTPRequestConfig = AxiosRequestConfig;

const api = (axios: AxiosInstance) => {
  return {
    get: <T>(url: string, config: HTTPRequestConfig = {}) => {
      return axios.get<T>(url, config);
    },
    delete: <T>(url: string, config: HTTPRequestConfig = {}) => {
      return axios.delete<T>(url, config);
    },
    put: <T>(url: string, body: unknown, config: HTTPRequestConfig = {}) => {
      return axios.put<T>(url, body, config);
    },
    patch: <T>(url: string, body: unknown, config: HTTPRequestConfig = {}) => {
      return axios.patch<T>(url, body, config);
    },
    post: <T>(url: string, body: unknown, config: HTTPRequestConfig = {}) => {
      return axios.post<T>(url, body, config);
    },
  };
};

export function IsTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));

    if (!decodedPayload.exp) return false;

    const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if an error occurs
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function GetAuthToken(navigate: Function): string {
  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/");
    throw new Error("Authentication token not found");
  }
  if (IsTokenExpired(token)) {
    localStorage.removeItem("authToken");
    navigate("/");
    throw new Error("Session expired. Please log in again.");
  }
  return token;
}

export const Http = api(instance);
