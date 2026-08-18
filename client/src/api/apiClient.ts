/* eslint-disable */

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASEURL =import.meta.env.;

const apiClient = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// Request Interceptor

// =====================================================

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =====================================================
// Response Interceptor
// =====================================================

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry the same request
    if (originalRequest?._retry) {
      localStorage.removeItem("access_token");

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Get Telegram initData
    const initData = (window as any).Telegram?.WebApp?.initData;

    if (!initData) {
      localStorage.removeItem("access_token");

      return Promise.reject(new Error("Telegram initData not found"));
    }

    try {
      // IMPORTANT:
      // Use plain axios here, NOT apiClient.
      // This prevents the interceptor from intercepting
      // the authentication request itself.
      const response = await axios.post(
        `${BASEURL}/auth/telegram`,
        {
          initData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const token = response.data?.access_token;

      if (!token) {
        throw new Error("Authentication failed");
      }

      // Save new token
      localStorage.setItem("access_token", token);

      // Attach token to original request
      originalRequest.headers.Authorization = `Bearer ${token}`;

      // Retry original request
      return apiClient(originalRequest);
    } catch (authError) {
      localStorage.removeItem("access_token");

      return Promise.reject(authError);
    }
  },
);

export default apiClient;
