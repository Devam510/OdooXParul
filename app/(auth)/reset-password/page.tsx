"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validators";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Failed to reset password");
      }

      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Request" subtitle="No reset token provided.">
        <div className="space-y-4 text-center">
          <div className="rounded-md bg-[var(--error)]/10 p-4 text-[var(--error)]">
            <p className="text-sm font-medium">Missing or invalid reset token. Please request a new one.</p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/forgot-password">Request Reset Link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be different from previous used passwords."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>New Password</FormLabel>
                 <FormControl>
                   <PasswordInput placeholder="Enter your new password" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>Confirm Password</FormLabel>
                 <FormControl>
                   <PasswordInput placeholder="Confirm your new password" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
            )}
          />

          <Button type="submit" className="w-full btn-accent" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
