import { baseAPI } from "../BaseApi/baseAPI";
import {
  DashboardAnalyticsResponse,
  ReportsAnalyticsResponse,
} from "./types/dashboard";

export const dashboardApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardAnalyticsResponse, void>({
      query: () => ({
        url: `/analytics/dashboard`,
        method: "GET",
      }),
    }),
    getReports: build.query<ReportsAnalyticsResponse, void>({
      query: () => ({
        url: `/analytics/reports`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardQuery, useGetReportsQuery } = dashboardApi;
