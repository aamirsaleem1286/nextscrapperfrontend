"use client";

import { cn } from "@/lib/utils";
import { tierColor } from "@/lib/utils";

interface LeadScoreBadgeProps {
  score: number;
  tier?: string;
  className?: string;
}

export function LeadScoreBadge({ score, tier, className }: LeadScoreBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex min-w-10 items-center justify-center rounded-md px-2 py-1 text-sm font-bold",
          className
        )}
      >
        {score}
      </span>
      {tier && (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            tierColor(tier)
          )}
        >
          {tier}
        </span>
      )}
    </div>
  );
}