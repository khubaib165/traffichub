"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast.success("Logged in successfully");
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto bg-gradient-to-r from-brand-purple to-brand-cyan rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">TrafficFlow</h1>
          <p className="text-text-muted text-sm mt-1">Traffic smarter. Scale faster.</p>
        </div>

        {/* Form Card */}
        <Card variant="glass">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-dark">
            <p className="text-sm text-text-muted text-center mb-3">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-brand-cyan hover:underline">
                Sign up
              </Link>
            </p>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-brand-cyan hover:underline block text-center"
            >
              Forgot password?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
