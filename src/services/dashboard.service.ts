/**
 * Dashboard service.
 */
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

export const dashboardService = {
  getStats: () => api.get<DashboardStats>("/api/dashboard"),
};