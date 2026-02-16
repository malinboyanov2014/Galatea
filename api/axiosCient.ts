import { API_BASE_URL } from "@/constants";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.warn("--- interceptor error", error);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data: any = (error.response as any)?.data;
    const serverMessage =
      data?.message ||
      data?.error ||
      data?.detail ||
      error.message ||
      "Request failed";
    console.error(serverMessage);
    if (status === 401) {
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
