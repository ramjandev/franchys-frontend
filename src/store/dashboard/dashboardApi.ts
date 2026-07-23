import { baseAPI } from "../BaseApi/baseAPI";
import { DashboardResponse } from "./types/dashboard";

export const dashboardApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardResponse, void>({
      query: () => ({
        url: `/analytics/dashboard`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
