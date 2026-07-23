import { ApiResponse } from "@/store/Auth/types/authTypes";

export interface DashboardSummary {
  totalRevenue: number;
  activeJobs: number;
  conversionRate: number;
  campaignsSent: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
}

export interface TopCustomer {
  [key: string]: unknown;
}

export interface CategoryPerformance {
  [key: string]: unknown;
}

export interface DashboardData {
  summary: DashboardSummary;
  revenueTrends: RevenueTrend[];
  topCustomers: TopCustomer[];
  categoryPerformance: CategoryPerformance[];
}

export type DashboardResponse = ApiResponse<DashboardData>;
