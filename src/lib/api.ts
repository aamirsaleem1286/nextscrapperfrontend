export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nexa_token");
}

async function request<T = any>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(init.headers || {});

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Accept", "application/json");

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...init,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      let errorData: Record<string, any> = { message: `HTTP ${response.status}` };
      if (isJson) {
        try {
          errorData = await response.json();
        } catch {
          // ignore parse errors
        }
      }
      const message =
        typeof errorData.detail === "string"
          ? errorData.detail
          : errorData.detail?.message || errorData.message || `HTTP ${response.status}`;
      throw new ApiError(response.status, message, errorData);
    }

    if (!isJson) {
      return (await response.blob()) as T;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(0, "Network error - is the backend running?");
    }
    throw error;
  }
}

export const api = {
  get: <T = unknown>(url: string, config?: RequestInit) =>
    fetchWith<T>(url, { ...config, method: "GET" }),
  post: <T = unknown>(url: string, data?: unknown, config?: RequestInit) =>
    fetchWith<T>(url, {
      ...config,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T = unknown>(url: string, data?: unknown, config?: RequestInit) =>
    fetchWith<T>(url, {
      ...config,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T = unknown>(url: string, config?: RequestInit) =>
    fetchWith<T>(url, { ...config, method: "DELETE" }),
};

// Alias so authApi (from the other file) can reuse the generic version
async function fetchWith<T>(url: string, init: RequestInit): Promise<T> {
  return request<T>(url, init);
}

type RequestConfig = RequestInit;

export default api;