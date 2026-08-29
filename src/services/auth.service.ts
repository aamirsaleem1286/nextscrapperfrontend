/**
 * Auth service - login, logout, token management.
 */
import { api } from "@/lib/api";
import type { TokenResponse, User } from "@/types";

const TOKEN_KEY = "nexa_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function login(username: string, password: string): Promise<TokenResponse> {
  const response = await api.post<{
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  }>("/api/auth/login", { username, password });

  setToken(response.access_token);
  return response;
}

async function getMe(): Promise<User> {
  return api.get<User>("/api/auth/me");
}

async function logout(): Promise<void> {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

function isAuthenticated(): boolean {
  return !!getToken();
}

export const authService = {
  login,
  logout,
  getMe,
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
};