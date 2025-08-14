'use client'

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Phone, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSendSchema, OtpSendData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OtpForm } from "@/components/otp-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const { user, sendOtpMutation, verifyOtpMutation } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect via useEffect
  }

  const phoneForm = useForm<OtpSendData>({
    resolver: zodResolver(otpSendSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleSendOtp = (data: OtpSendData) => {
    setPhoneNumber(data.phoneNumber);
    sendOtpMutation.mutate(data, {
      onSuccess: () => {
        setStep("otp");
      },
    });
  };

  const handleVerifyOtp = (otp: string) => {
    verifyOtpMutation.mutate({
      phoneNumber: phoneNumber,
      otp: otp,
    });
  };

  const handleBackToPhone = () => {
    setStep("phone");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-notion-gray-light">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Form */}
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-notion-blue rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === "phone" ? "Admin Login" : "Verify Code"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === "phone" 
                ? "Enter your phone number to receive a verification code" 
                : `Enter the 6-digit code sent to ${phoneNumber}`
              }
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            {step === "phone" ? (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                  <FormField
                    control={phoneForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10 h-12 border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2 transition-colors duration-200"
                              data-testid="input-phone"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 bg-notion-blue hover:bg-notion-blue-dark text-white font-medium transition-colors duration-200"
                    disabled={sendOtpMutation.isPending}
                    data-testid="button-send-otp"
                  >
                    {sendOtpMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <OtpForm
                onSubmit={handleVerifyOtp}
                onBack={handleBackToPhone}
                isLoading={verifyOtpMutation.isPending}
                phoneNumber={phoneNumber}
              />
            )}
          </div>
        </div>

        {/* Right Column - Hero */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="mx-auto h-32 w-32 bg-notion-blue rounded-2xl flex items-center justify-center mb-8">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">Neighborly Admin</h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Manage driver applications with ease. Streamlined approval process for ride-sharing services.
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mt-8">
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Review driver applications</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-purple rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Approve or reject with reasons</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Secure OTP authentication</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}