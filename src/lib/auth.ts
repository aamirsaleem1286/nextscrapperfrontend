"use client";

import { api } from "./api";
import type { User, TokenResponse } from "@/types";

const TOKEN_KEY = "nexa_token";

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AuthError";
  }
}

// Token helpers (shared with auth.service.ts)
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setTokenStorage = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeTokenStorage = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const auth = {
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const response = await api.post<{ access_token: string; user: User }>(
      "/api/auth/login",
      { username, password }
    );
    setTokenStorage(response.access_token);
    return response;
  },

  logout: (): void => {
    removeTokenStorage();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  isAuthenticated: (): boolean => !!getToken(),

  getUserFromToken: (): User | null => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        username: payload.username || "",
        email: payload.email || "",
        full_name: payload.full_name || payload.name || "",
        role: payload.role || "admin",
        created_at: payload.iat
          ? new Date(payload.iat * 1000).toISOString()
          : "",
      };
    } catch {
      return null;
    }
  },

  setToken: setTokenStorage,
  getToken,
};