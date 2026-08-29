"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { exportsService } from "@/services/exports.service";
import type { ExportRequest } from "@/types";

export function useExports(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ["exports", params],
    queryFn: () => exportsService.list(params),
    refetchInterval: (query) => {
      const items = query.state.data?.items || [];
      const hasPending = items.some((e) => e.status === "queued" || e.status === "running");
      return hasPending ? 4000 : false;
    },
  });
}

export function useCreateExport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExportRequest) => exportsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exports"] });
    },
  });
}