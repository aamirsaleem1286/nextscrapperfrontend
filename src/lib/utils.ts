import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | undefined | null): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function formatRating(r: number | undefined | null): string {
  if (r === undefined || r === null) return "—";
  return r.toFixed(1);
}

export function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function tierColor(tier: string | undefined): string {
  switch (tier) {
    case "Excellent":
      return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
    case "High":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "Medium":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "Low":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
  }
}

export function statusColor(status: string | undefined): string {
  switch (status) {
    case "running":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "queued":
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
    case "paused":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "completed":
      return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
    case "failed":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
    case "cancelled":
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
  }
}