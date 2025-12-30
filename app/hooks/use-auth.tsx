'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User, EmailPasswordLoginData, ApiResponse, AuthResponse } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  accessToken: string | null;
  loginMutation: UseMutationResult<ApiResponse<AuthResponse>, Error, EmailPasswordLoginData>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize access token on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
      setIsInitialized(true);
    }
  }, []);

  // Listen for storage changes (e.g., logout in another tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setAccessToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    enabled: !!accessToken && isInitialized,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1, // Only retry once on failure
    queryFn: async () => {
      if (!accessToken) return null;
      
      try {
        const response = await fetch("https://api.neighborly.live/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Token is invalid or expired
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setAccessToken(null);
            queryClient.setQueryData(["/api/user"], null);
            return null;
          }
          throw new Error(`Authentication failed: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error("Invalid response format");
        }
        
        return result.data;
      } catch (error) {
        console.error("Auth query error:", error);
        console.log("Access token:", accessToken);
        
        // Only clear tokens if it's an authentication error (401/403)
        // Don't clear tokens for network errors or other issues
        if (error instanceof Error && error.message.includes("Authentication failed")) {
          console.log("Clearing tokens due to auth failure");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAccessToken(null);
          queryClient.setQueryData(["/api/user"], null);
        }
        
        throw error;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: EmailPasswordLoginData) => {
      const response = await fetch("https://api.neighborly.live/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage = "Failed to login";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    },
    onSuccess: (response: ApiResponse<AuthResponse>) => {
      const { accessToken, user } = response.data;
      const refreshToken = response.data.refreshToken; // Optional, may not be present
      
      // Check if user has admin role
      if (user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin dashboard.",
          variant: "destructive",
        });
        return;
      }
      
      // Store access token
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);
      
      // Store refresh token only if provided
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      
      // Update query cache with user data
      queryClient.setQueryData(["/api/user"], user);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      
      router.push("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    
    // Clear state
    setAccessToken(null);
    
    // Clear query cache
    queryClient.setQueryData(["/api/user"], null);
    queryClient.clear();
    
    // Show toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Navigate to auth page
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: !isInitialized || isLoading,
        error,
        accessToken,
        loginMutation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}