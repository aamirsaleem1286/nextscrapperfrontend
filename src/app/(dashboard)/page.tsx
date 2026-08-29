"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ScoreDistributionChart,
  RatingHistogramChart,
  SourceSplitChart,
  TopCategoriesChart,
} from "@/components/dashboard/charts";
import {
  Building2,
  Star,
  Target,
  Globe,
  Mail,
  Phone,
  Copy,
  Loader2,
} from "lucide-react";
import { formatNumber, formatRating } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading } = useDashboard();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const t = stats?.totals;
  const c = stats?.charts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Business intelligence overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Businesses"
          value={formatNumber(t?.businesses || 0)}
          icon={Building2}
          accent="default"
        />
        <StatCard
          title="Average Rating"
          value={formatRating(t?.avg_rating)}
          icon={Star}
          accent="positive"
        />
        <StatCard
          title="Average Lead Score"
          value={t?.avg_score?.toFixed(1) || "0"}
          icon={Target}
          accent="default"
        />
        <StatCard
          title="Missing Website"
          value={t?.missing_website || 0}
          icon={Globe}
          accent="warning"
          subtitle={`${t?.missing_email || 0} missing email, ${t?.missing_phone || 0} missing phone`}
        />
      </div>

      {/* Second row of stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Missing Email"
          value={t?.missing_email || 0}
          icon={Mail}
          accent="neutral"
        />
        <StatCard
          title="Missing Phone"
          value={t?.missing_phone || 0}
          icon={Phone}
          accent="neutral"
        />
        <StatCard
          title="Duplicates"
          value={t?.duplicate_count || 0}
          icon={Copy}
          accent="warning"
        />
        <StatCard
          title="Exports"
          value={t?.export_count || 0}
          icon={Building2}
          accent="neutral"
          subtitle={`${t?.running_jobs || 0} running, ${t?.completed_jobs || 0} completed, ${t?.failed_jobs || 0} failed jobs`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreDistributionChart data={c?.score_distribution || []} />
        <RatingHistogramChart data={c?.rating_histogram || []} />
        <SourceSplitChart data={c?.source_split || []} />
        <TopCategoriesChart data={c?.top_categories || []} />
      </div>
    </div>
  );
}