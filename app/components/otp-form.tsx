'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Key } from "lucide-react";

interface OtpFormProps {
  onSubmit: (otp: string) => void;
  onBack: () => void;
  isLoading: boolean;
  phoneNumber: string;
}

export function OtpForm({ onSubmit, onBack, isLoading, phoneNumber }: OtpFormProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Verification Code</label>
          <p className="text-xs text-gray-500">
            Enter the 6-digit code sent to {phoneNumber}
          </p>
        </div>
        
        <InputOTP 
          maxLength={6} 
          value={otp} 
          onChange={setOtp}
          data-testid="input-otp"
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
            <InputOTPSlot index={1} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
            <InputOTPSlot index={2} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
            <InputOTPSlot index={3} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
            <InputOTPSlot index={4} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
            <InputOTPSlot index={5} className="w-12 h-12 text-lg font-medium border-gray-200 focus:border-notion-blue focus:ring-notion-blue/20 focus:ring-2" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full h-12 bg-notion-blue hover:bg-notion-blue-dark text-white font-medium transition-colors duration-200"
          disabled={otp.length !== 6 || isLoading}
          data-testid="button-verify-otp"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              Verify Code
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          onClick={onBack}
          disabled={isLoading}
          data-testid="button-back-to-phone"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to phone number
        </Button>
      </div>
    </form>
  );
}