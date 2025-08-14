'use client'

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest(method: string, url: string, data?: any) {
  const token = localStorage.getItem("accessToken");
  
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`https://api.neighborly.live/api${url}`, config);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.setQueryData(["/api/user"], null);
    }
    
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If parsing JSON fails, use the default error message
    }
    
    throw new ApiError(errorMessage, response.status);
  }

  return response;
}

export function getQueryFn({ on401 }: { on401?: "returnNull" } = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    try {
      const [url] = queryKey;
      const response = await apiRequest("GET", url);
      const data = await response.json();
      return data.success ? data.data : data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
}