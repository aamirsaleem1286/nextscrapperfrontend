/**
 * TypeScript types mirroring backend Pydantic schemas.
 * Kept in sync manually — API drift caught by typecheck.
 */

// --- Auth ---
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// --- Jobs ---
export type JobStatus = "queued" | "running" | "paused" | "completed" | "failed" | "cancelled";
export type JobSource = "playwright" | "places_api" | "osm";

export interface Job {
  id: string;
  job_type: string;
  status: JobStatus;
  keyword: string;
  country?: string;
  state?: string;
  city?: string;
  max_results: number;
  source: JobSource;
  progress: number;
  total_found: number;
  processed: number;
  new_count: number;
  duplicate_count: number;
  error_count: number;
  error_message?: string;
  result_summary_json?: string;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

export interface ScrapeRequest {
  keyword: string;
  country?: string;
  state?: string;
  city?: string;
  max_results: number;
  source: JobSource;
}

// --- Businesses ---
export type QualityTier = "Excellent" | "High" | "Medium" | "Low";

export interface BusinessListItem {
  id: string;
  name: string;
  category?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviews_count?: number;
  lead_score: number;
  quality_tier?: QualityTier;
  source: string;
  is_duplicate: boolean;
  verification_status: string;
  created_at: string;
}

export interface BusinessDetail {
  id: string;
  place_id?: string;
  source: string;
  name: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  phone_normalized?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  google_maps_url?: string;
  rating?: number;
  reviews_count?: number;
  opening_hours?: Record<string, string>[];
  business_status?: string;
  year_established?: number;
  industry?: string;
  services?: string[];
  brands?: string[];
  company_size?: string;
  facebook_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  ssl_valid?: boolean;
  cms?: string;
  mobile_friendly?: boolean;
  seo_score?: number;
  has_google_analytics?: boolean;
  has_meta_pixel?: boolean;
  has_contact_form?: boolean;
  has_online_booking?: boolean;
  has_live_chat?: boolean;
  has_ecommerce?: boolean;
  website_checked_at?: string;
  research_sources?: string[];
  verification_status: string;
  last_verified_at?: string;
  notes?: string;
  lead_score: number;
  quality_tier?: QualityTier;
  is_duplicate: boolean;
  duplicate_group_id?: string;
  source_job_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ScoreBreakdownItem {
  criterion: string;
  points: number;
  earned: boolean;
  detail: string;
}

export interface ScoreBreakdown {
  score: number;
  tier: QualityTier;
  breakdown: ScoreBreakdownItem[];
}

// --- Exports ---
export type ExportFormat = "csv" | "xlsx" | "json" | "sql";

export interface ExportRequest {
  format: ExportFormat;
  business_ids?: string[];
  filters?: Record<string, unknown>;
  filename?: string;
}

export interface ExportRecord {
  id: string;
  export_type: ExportFormat;
  status: string;
  file_name?: string;
  file_path?: string;
  row_count: number;
  filters_json?: string;
  error_message?: string;
  created_at: string;
  finished_at?: string;
}

// --- Dashboard ---
export interface DashboardTotals {
  businesses: number;
  avg_rating: number;
  avg_score: number;
  missing_website: number;
  missing_email: number;
  missing_phone: number;
  duplicate_count: number;
  export_count: number;
  running_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardCharts {
  score_distribution: ChartPoint[];
  rating_histogram: ChartPoint[];
  source_split: ChartPoint[];
  top_categories: ChartPoint[];
  scrape_history: ChartPoint[];
}

export interface DashboardStats {
  totals: DashboardTotals;
  charts: DashboardCharts;
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
