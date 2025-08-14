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
  
  console.log(`Making API request to: ${BASE_URL}${endpoint}`);
  console.log("Request options:", options);
  console.log("Access token:", accessToken ? "Present" : "Missing");
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));

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
    
    console.error("API request failed:", {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      errorMessage
    });
    
    throw new ApiError(response.status, errorMessage);
  }

  const data = await response.json();
  console.log("API response data:", data);
  return data;
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
};
