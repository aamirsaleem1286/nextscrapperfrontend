"use client";

import { cn, statusColor } from "@/lib/utils";

export function StatusBadge({ status }: { status?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        statusColor(status)
      )}
    >
      {status || "unknown"}
    </span>
  );
}