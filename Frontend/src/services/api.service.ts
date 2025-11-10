import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api.types';
import axiosInstance, { setToken as setAuthToken, removeToken as removeAuthToken } from '@/lib/axios';

// Generic request methods
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(url, config);
  return response.data;
};

export const post = async <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
  return response.data;
};

export const put = async <T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
  return response.data;
};

// File upload
export const uploadFile = async <T>(
  url: string,
  file: File,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  });

  return response.data;
};

// Token management
export const setToken = (token: string): void => {
  setAuthToken(token);
};

export const removeToken = (): void => {
  removeAuthToken();
};

// Export axios instance for advanced use cases
export { axiosInstance };

// Default export
export default {
  get,
  post,
  put,
  delete: del,
  uploadFile,
  setToken,
  removeToken,
  axiosInstance,
};
