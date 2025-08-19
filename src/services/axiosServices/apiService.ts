import api from "@/lib/axios/axiosInstance"; 
import { AxiosRequestConfig } from "axios";

export type ApiResponse<T = any> = {
  success: boolean;
  status: number;
  data?: T;
  details?: any;
};

export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  const res = await api.post<T>(url, data);
  return res.data;
}

export async function apiGet<T = any>(url: string, params?: any): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data;
}
export const apiRequest = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const res = await api.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return {
      success: true,
      status: res.status,
      data: res.data,
    };
  } catch (error: any) {
    const status = error.response?.status || 500;
    let message = "Server error";

    if (status === 404) message = "The requested API endpoint was not found.";
    else if (status === 400) message = "Bad request: Check your form data.";
    else if (status >= 500) message = "Internal server error.";

    return {
      success: false,
      status,
      details: { message },
    };
  }
};