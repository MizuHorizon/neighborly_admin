import { z } from "zod";

export const otpSendSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const otpVerifySchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const otpOnlySchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const rejectApplicationSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export type OtpSendData = z.infer<typeof otpSendSchema>;
export type OtpVerifyData = z.infer<typeof otpVerifySchema>;
export type RejectApplicationData = z.infer<typeof rejectApplicationSchema>;

export interface User {
  id: string;
  phone: string;
  profile_picture: string | null;
  isVerified: boolean;
  name: string;
  dob: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isProfileComplete: boolean;
  role: string;
  lastLocation: string | null;
  admin_verified: boolean; // Added field to check if admin is verified
  status: string; // Added field for user status: pending, approved, or admin_verified
}

export interface Car {
  car_id: string;
  driver_id: string | null;
  vehicle_type_id: string | null;
  photo_url: string | null;
  car_name: string;
  car_model: string;
  car_year: number;
  license_plate: string;
  car_color: string;
  color: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverApplication {
  application_id: string;
  phone_number: string;
  photo_url: string;
  user_id: string | null;
  status: string;
  full_name: string;
  date_of_birth: string;
  address: string;
  email: string;
  driving_license_url: string;
  driving_license_number: string;
  driving_license_expiry_date: string;
  vehicle_registration_url: string;
  vehicle_registration_number: string;
  insurance_document_url: string;
  insurance_expiry_date: string;
  insurance_document_number: string;
  car_sticker_url: string;
  car_id: string;
  reviewed_by: string | null;
  rejection_reason: string | null;
  stripe_onboarding_url: string | null;
  stripe_onboarding_expires_at: string | null;
  stripe_onboarding_completed: boolean;
  stripe_connect_account_id: string | null;
  created_at: string;
  updated_at: string;
  car: Car;
}

export interface ApiResponse<T> {
  message: string;
  error: string;
  success: boolean;
  data: T;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
