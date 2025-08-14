import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { otpOnlySchema } from "@shared/schema";

interface OtpFormProps {
  phoneNumber: string;
  isLoading: boolean;
  onSubmit: (otp: string) => void;
  onBack: () => void;
}

export function OtpForm({ phoneNumber, isLoading, onSubmit, onBack }: OtpFormProps) {
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<{ otp: string }>({
    resolver: zodResolver(otpOnlySchema),
    defaultValues: {
      otp: "",
    },
  });

  // Focus the input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (data: { otp: string }) => {
    onSubmit(data.otp);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">Verification Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest h-16 border-border bg-white"
                  data-testid="input-otp"
                  onChange={(e) => {
                    // Only allow numeric input
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-foreground text-white hover:bg-gray-800 shadow-sm"
          disabled={isLoading}
          data-testid="button-verify-otp"
        >
          {isLoading ? "Verifying..." : "Verify & Sign In"}
        </Button>
        
        <Button 
          type="button" 
          variant="ghost"
          className="w-full h-10 text-muted-foreground hover:bg-notion-gray"
          onClick={onBack}
          data-testid="button-back-to-phone"
        >
          ← Back to Phone Number
        </Button>
      </form>
    </Form>
  );
}