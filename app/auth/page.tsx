'use client'

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailPasswordLoginSchema, EmailPasswordLoginData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (user) {
    return null; // Will redirect via useEffect
  }

  const loginForm = useForm<EmailPasswordLoginData>({
    resolver: zodResolver(emailPasswordLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: EmailPasswordLoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-notion-gray-light">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Form */}
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-notion-black rounded-lg flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-notion-text">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-notion-text-muted">
              Enter your email and password to access the admin dashboard
            </p>
          </div>

          <div className="bg-white border border-notion-border rounded-lg shadow-sm p-8">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-notion-text">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-light" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="admin@neighborly.com"
                            className="pl-10 h-12 border-notion-border bg-white text-notion-text placeholder:text-notion-text-light focus:border-notion-black focus:ring-notion-black/20 focus:ring-2 transition-all duration-200"
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-notion-text">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-light" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 border-notion-border bg-white text-notion-text placeholder:text-notion-text-light focus:border-notion-black focus:ring-notion-black/20 focus:ring-2 transition-all duration-200"
                            data-testid="input-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-notion-black hover:bg-notion-text-muted text-white font-medium transition-colors duration-200"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Column - Hero */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="mx-auto h-32 w-32 bg-notion-black rounded-2xl flex items-center justify-center mb-8">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-notion-text">Neighborly Admin</h1>
              <p className="text-xl text-notion-text-muted max-w-md mx-auto">
                Manage driver applications with ease. Streamlined approval process for ride-sharing services.
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mt-8">
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-notion-text-muted">Review driver applications</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-notion-text-muted">Approve or reject with reasons</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-8 w-8 bg-notion-black rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-notion-text-muted">Secure email authentication</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}