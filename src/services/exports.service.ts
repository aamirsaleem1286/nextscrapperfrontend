/**
 * Export service - create, list, download exports.
 */
import { api } from "@/lib/api";
import type { ExportRecord, ExportRequest } from "@/types";

export const exportsService = {
  create: (request: ExportRequest) =>
    api.post<ExportRecord>("/api/exports", request),

  list: (params?: { page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    return api.get<{ items: ExportRecord[]; total: number }>(`/api/exports?${qs.toString()}`);
  },

  get: (id: string) => api.get<ExportRecord>(`/api/exports/${id}`),

  downloadUrl: (id: string) =>
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/exports/${id}/download`,
};

export async function downloadExport(id: string, fileName?: string): Promise<void> {
  const blob = await api.get<Blob>(`/api/exports/${id}/download`);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || `export-${id}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}