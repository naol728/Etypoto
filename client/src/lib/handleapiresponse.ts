import axios, { AxiosError, type AxiosResponse } from "axios";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Handles an API call globally.
 *
 * Returns the API response data or throws a clean Error.
 *
 * IMPORTANT:
 * This function does NOT redirect on 401.
 * Authentication-specific handling should be done by the
 * auth service / React Query mutation.
 */
export async function handleApiResponse<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
): Promise<T> {
  try {
    const response = await apiCall();

    if (!response?.data) {
      throw new Error("Empty response from server.");
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      const serverMessage =
        data?.message ??
        Object.values(data?.errors ?? {})[0]?.[0] ??
        "An unknown error occurred.";

      // Don't redirect here.
      // A 401 can mean invalid login credentials.
      // The caller should decide what to do.
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unexpected error occurred.");
  }
}
