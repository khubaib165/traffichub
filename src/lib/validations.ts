import { z } from "zod";

// Campaign validation schema
export const campaignCreateSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters").max(100),
  format: z.enum(["push-web", "push-mobile", "banner-web", "banner-mobile"]),
  title: z.string().min(5, "Title must be at least 5 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  landingUrl: z.string().url("Invalid URL"),
  dailyBudget: z.number().positive("Daily budget must be positive"),
  totalBudget: z.number().positive("Total budget must be positive"),
  bidAmount: z.number().positive("Bid amount must be positive"),
  bidType: z.enum(["cpc", "cpm", "cpv"]),
  targetCountries: z.array(z.string()).min(1, "Select at least one country"),
  targetDevices: z.array(z.string()).min(1, "Select at least one device"),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Wallet validation
export const depositSchema = z.object({
  amount: z.number().positive("Amount must be positive").min(1, "Minimum deposit is $1"),
  paymentMethod: z.enum(["card", "crypto"]),
});

// Export types
export type CampaignCreateInput = z.infer<typeof campaignCreateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
