"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import { LoginInput } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    await login(data);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your details to access your account."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal text-[var(--primary-muted)]">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full btn-accent" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
