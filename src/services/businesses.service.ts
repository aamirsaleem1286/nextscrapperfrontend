/**
 * Business service - list, filter, and detail.
 */
import { api } from "@/lib/api";
import type {
  BusinessDetail,
  BusinessListItem,
  PaginatedResponse,
  ScoreBreakdown,
} from "@/types";

export interface BusinessQueryParams {
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  min_rating?: number;
  min_score?: number;
  max_score?: number;
  tier?: string;
  source?: string;
  has_website?: boolean;
  has_email?: boolean;
  has_phone?: boolean;
  is_duplicate?: boolean;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export const businessesService = {
  list: (params: BusinessQueryParams = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    return api.get<PaginatedResponse<BusinessListItem>>(`/api/businesses?${qs.toString()}`);
  },

  get: (id: string) => api.get<BusinessDetail>(`/api/businesses/${id}`),

  score: (id: string) => api.get<ScoreBreakdown>(`/api/businesses/${id}/score`),
};