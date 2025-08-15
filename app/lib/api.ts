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
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If we can't parse the error response, use the default message
    }
    
    throw new ApiError(response.status, errorMessage);
  }

  return await response.json();
}

export const api = {
  getDriverApplications: (status?: string) =>
    makeRequest<ApiResponse<DriverApplication[]>>(`/driver-applications${status ? `?status=${status}` : ""}`),
    
  approveApplication: (applicationId: string) =>
    makeRequest<ApiResponse<any>>(`/driver-applications/${applicationId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }),
    
  rejectApplication: (applicationId: string, reason: string) =>
    makeRequest<ApiResponse<any>>(`/driver-applications/${applicationId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }),

  // Add refresh onboarding URL endpoint for Stripe Connect
  refreshOnboardingUrl: (accountId: string) =>
    makeRequest<ApiResponse<any>>(`/stripe/connect/${accountId}/refresh-onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }),
};
