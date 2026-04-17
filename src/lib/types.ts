// User types
export type UserRole = "advertiser" | "admin" | "support";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign types
export type CampaignStatus = "draft" | "pending" | "active" | "paused" | "rejected" | "completed";
export type CampaignFormat = "push-web" | "push-mobile" | "banner-web" | "banner-mobile";
export type CampaignOptimization = "ctr" | "conversions" | "reach" | "engagement";

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  format: CampaignFormat;
  status: CampaignStatus;
  title: string;
  description: string;
  imageUrl?: string;
  landingUrl: string;
  dailyBudget: number;
  totalBudget: number;
  bidType: "cpc" | "cpm" | "cpv";
  bidAmount: number;
  targetCountries: string[];
  targetDevices: string[];
  targetOS: string[];
  targetBrowsers: string[];
  schedule: {
    timezone: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
  optimization: CampaignOptimization;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  stats?: CampaignStats;
}

export interface CampaignStats {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversionRate: number;
}

// Analytics types
export type MetricType = "impressions" | "clicks" | "conversions" | "spend" | "ctr" | "cpm" | "cpc";

export interface AnalyticsPoint {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversionRate: number;
}

export interface DimensionalData {
  name: string;
  value: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpm: number;
}

// Wallet types
export type TransactionType = "deposit" | "withdraw" | "campaign-spend" | "refund" | "bonus";
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: string;
  metaData?: Record<string, any>;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalDeposited: number;
  totalSpent: number;
  updatedAt: Date;
}

// Notification types
export type NotificationType = "campaign-approved" | "campaign-rejected" | "low-balance" | "daily-report" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Push.House API types
export interface PushHouseFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview?: {
    web: string;
    mobile: string;
  };
}

export interface PushHouseNetwork {
  id: string;
  name: string;
  countries: string[];
  bidRange: {
    min: number;
    max: number;
  };
  formats: string[];
  stats?: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
  };
}

export interface PushHouseTraffic {
  country: string;
  region?: string;
  city?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  bid: number;
}
