"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import type { ChartPoint } from "@/types";

const TIER_COLORS = {
  Excellent: "#22C55E",
  High: "#3B82F6",
  Medium: "#F59E0B",
  Low: "#EF4444",
  Unknown: "#9CA3AF",
};

const BAR_COLOR = "hsl(221.2, 83.2%, 53.3%)";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function ScoreDistributionChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Lead Score Distribution">
        <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Lead Score Distribution">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={TIER_COLORS[entry.label as keyof typeof TIER_COLORS] || BAR_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RatingHistogramChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Rating Distribution">
        <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Rating Distribution">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function SourceSplitChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Data Source Split">
        <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </div>
      </ChartCard>
    );
  }

  const SOURCE_COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <ChartCard title="Data Source Split">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopCategoriesChart({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Top Categories">
        <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Top Categories">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={100} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}