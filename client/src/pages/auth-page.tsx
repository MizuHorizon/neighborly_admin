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
    <div className="min-h-screen flex items-center justify-center px-4 bg-notion-gray-light">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Form */}
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-foreground rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {step === "phone" ? "Admin Login" : "Verify Code"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "phone" 
                ? "Enter your phone number to receive a verification code" 
                : `Enter the 6-digit code sent to ${phoneNumber}`
              }
            </p>
          </div>

          <div className="notion-card border-0 shadow-notion">
            <div className="p-8">
              {step === "phone" ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                    <FormField
                      control={phoneForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="pl-12 border-border bg-white h-12 text-base"
                                data-testid="input-phone-number"
                              />
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-foreground text-white hover:bg-gray-800 shadow-sm"
                      disabled={sendOtpMutation.isPending}
                      data-testid="button-send-otp"
                    >
                      {sendOtpMutation.isPending ? "Sending..." : "Send Verification Code"}
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
                          <FormLabel className="text-sm font-medium text-foreground">Verification Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="123456"
                              maxLength={6}
                              className="text-center text-2xl font-mono tracking-widest h-16 border-border bg-white"
                              data-testid="input-otp"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-foreground text-white hover:bg-gray-800 shadow-sm"
                      disabled={verifyOtpMutation.isPending}
                      data-testid="button-verify-otp"
                    >
                      {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost"
                      className="w-full h-10 text-muted-foreground hover:bg-notion-gray"
                      onClick={handleBackToPhone}
                      data-testid="button-back-to-phone"
                    >
                      ← Back to Phone Number
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Hero Section */}
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-foreground rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Neighborly
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Admin dashboard for reviewing and managing driver applications with secure phone verification.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-notion-green rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-notion-green-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Secure Authentication</h3>
                  <p className="text-xs text-muted-foreground">Phone-based OTP verification</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-notion-blue rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-notion-blue-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Application Review</h3>
                  <p className="text-xs text-muted-foreground">Streamlined approval workflow</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-notion-purple rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-notion-purple-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Real-time Updates</h3>
                  <p className="text-xs text-muted-foreground">Instant application status changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
