import { ApiResponse } from "@/store/Auth/types/authTypes";

// ---------- shared ----------
export interface RevenueTrend {
  month: string;
  revenue: number;
}

// ---------- dashboard ----------
export type DashboardAnalyticsResponse = ApiResponse<DashboardAnalyticsData>;

export interface DashboardAnalyticsData {
  summary: DashboardSummary;
  revenueTrends: RevenueTrend[];
  topCustomers: TopCustomer[];
  categoryPerformance: CategoryPerformance[];
}

export interface DashboardSummary {
  totalRevenue: number;
  activeJobs: number;
  pendingApprovals: number;
  unpaidInvoices: number;
  conversionRate: number;
  campaignsSent: number;
}

export interface TopCustomer {
  customerId: string;
  name: string;
  totalSpent: number;
}

export interface CategoryPerformance {
  categoryName: string;
  volume: number;
}

// ---------- reports ----------
export type ReportsAnalyticsResponse = ApiResponse<ReportsAnalyticsData>;

export interface ReportsAnalyticsData {
  summary: ReportsSummary;
  revenueTrends: RevenueTrend[];
  topCustomers: ReportsTopCustomer[];
  quoteStatusBreakdown: QuoteStatusBreakdown;
  productPerformance: ProductPerformance[];
}

export interface ReportsSummary {
  totalRevenue: number;
  revenueGrowthPercent: number;
  activeCustomers: number;
  activeCustomersGrowthPercent: number;
  quotesSent: number;
  quotesSentGrowthPercent: number;
  productsSold: number;
  productsSoldGrowthPercent: number;
}

export interface ReportsTopCustomer {
  customerId: string;
  name: string;
  ordersCount: number;
  totalSpent: number;
}

export type QuoteStatus = "approved" | "sent" | "draft" | "declined";

export interface QuoteStatusBreakdownEntry {
  count: number;
  percentage: number;
}

export interface QuoteStatusBreakdown {
  total: number;
  breakdown: Record<QuoteStatus, QuoteStatusBreakdownEntry>;
}

export interface ProductPerformance {
  productName: string;
  category: string;
  unitsSold: number;
  revenue: number;
}
