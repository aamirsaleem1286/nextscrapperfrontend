"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getStats,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll while there are running jobs
      if (data?.totals?.running_jobs && data.totals.running_jobs > 0) {
        return 10_000;
      }
      return false;
    },
  });
}