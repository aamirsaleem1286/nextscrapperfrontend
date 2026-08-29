"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { scrapeService } from "@/services/scrape.service";
import type { Job, ScrapeRequest } from "@/types";

export function useJobs(params?: { job_status?: string }) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => scrapeService.getJobs(params),
    refetchInterval: (query) => {
      const jobs = query.state.data?.items || [];
      const hasActive = jobs.some(
        (j) => j.status === "running" || j.status === "queued"
      );
      return hasActive ? 5000 : false;
    },
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => scrapeService.getJob(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "running" || status === "queued" ? 3000 : false;
    },
  });
}

export function useCreateScrapeJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScrapeRequest) => scrapeService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function usePauseJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scrapeService.pauseJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

export function useResumeJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scrapeService.resumeJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scrapeService.cancelJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}