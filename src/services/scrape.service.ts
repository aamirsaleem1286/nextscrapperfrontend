/**
 * Scrape service - create scrape jobs.
 */
import { api } from "@/lib/api";
import type { Job, ScrapeRequest } from "@/types";

export const scrapeService = {
  createJob: (request: ScrapeRequest) =>
    api.post<Job>("/api/scrape", request),

  getJobs: (params?: {
    job_status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.job_status) qs.set("job_status", params.job_status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    return api.get<{ items: Job[]; total: number; page: number; page_size: number }>(
      `/api/jobs?${qs.toString()}`
    );
  },

  getJob: (id: string) => api.get<Job>(`/api/jobs/${id}`),

  pauseJob: (id: string) => api.post<{ id: string; status: string; message: string }>(`/api/jobs/${id}/pause`),
  resumeJob: (id: string) => api.post<{ id: string; status: string; message: string }>(`/api/jobs/${id}/resume`),
  cancelJob: (id: string) => api.post<{ id: string; status: string; message: string }>(`/api/jobs/${id}/cancel`),
};