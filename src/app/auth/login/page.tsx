"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isInitialized } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isInitialized && auth?.currentUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (!isInitialized || !auth) {
      toast.error("Firebase not initialized. Please check your configuration.");
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        toast.success("Logged in successfully!");
        
        // Redirect to dashboard after brief delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase errors
      if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/user-disabled") {
        toast.error("Account has been disabled");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
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
