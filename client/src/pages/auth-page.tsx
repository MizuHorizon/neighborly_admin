import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Phone, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSendSchema, otpVerifySchema, OtpSendData, OtpVerifyData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user, sendOtpMutation, verifyOtpMutation } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Redirect if already authenticated
  if (user) {
    return <Redirect to="/" />;
  }

  const phoneForm = useForm<OtpSendData>({
    resolver: zodResolver(otpSendSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpForm = useForm<OtpVerifyData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
  });

  const handleSendOtp = (data: OtpSendData) => {
    setPhoneNumber(data.phoneNumber);
    otpForm.setValue("phoneNumber", data.phoneNumber);
    sendOtpMutation.mutate(data, {
      onSuccess: () => {
        setStep("otp");
      },
    });
  };

  const handleVerifyOtp = (data: OtpVerifyData) => {
    verifyOtpMutation.mutate(data);
  };

  const handleBackToPhone = () => {
    setStep("phone");
    otpForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Form */}
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === "phone" ? "Admin Login" : "Verify OTP"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === "phone" 
                ? "Sign in to your admin account" 
                : `Enter the code sent to ${phoneNumber}`
              }
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              {step === "phone" ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                    <FormField
                      control={phoneForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="pl-12"
                                data-testid="input-phone-number"
                              />
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={sendOtpMutation.isPending}
                      data-testid="button-send-otp"
                    >
                      {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enter 6-digit code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="123456"
                              maxLength={6}
                              className="text-center text-2xl font-mono tracking-widest"
                              data-testid="input-otp"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={verifyOtpMutation.isPending}
                      data-testid="button-verify-otp"
                    >
                      {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Login"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost"
                      className="w-full"
                      onClick={handleBackToPhone}
                      data-testid="button-back-to-phone"
                    >
                      Back to Phone Number
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Hero Section */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="mx-auto h-32 w-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Neighborly Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Manage driver applications with secure OTP authentication. 
                Review, approve, and reject applications efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto text-left">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Key className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Secure OTP Authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Application Management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
