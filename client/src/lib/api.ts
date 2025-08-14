import { DriverApplication, ApiResponse } from "@shared/schema";

const BASE_URL = "https://api.neighborly.live/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export const api = {
  getDriverApplications: (status: string = "pending") =>
    makeRequest<ApiResponse<DriverApplication[]>>(`/driver-applications?status=${status}`),
    
  approveApplication: (applicationId: string) =>
    makeRequest<ApiResponse<any>>(`/driver-applications/${applicationId}/approve`, {
      method: "POST",
    }),
    
  rejectApplication: (applicationId: string, reason: string) =>
    makeRequest<ApiResponse<any>>(`/driver-applications/${applicationId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};
