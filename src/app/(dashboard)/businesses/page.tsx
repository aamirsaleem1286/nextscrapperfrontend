"use client";

import { useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, formatNumber, formatRating, timeAgo } from "@/lib/utils";
import {
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
} from "lucide-react";
import type { BusinessListItem } from "@/types";
import type { BusinessQueryParams } from "@/services/businesses.service";
import { useCreateExport } from "@/hooks/useExports";
import { toast } from "sonner";

export default function BusinessesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const [source, setSource] = useState("");

  const filters: BusinessQueryParams = {
    search: search || undefined,
    tier: tier || undefined,
    source: source || undefined,
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_dir: sortDir,
  };

  const { data, isLoading } = useBusinesses(filters);
  const createExport = useCreateExport();

  const handleExport = () => {
    createExport.mutate(
      {
        format: "xlsx",
        filters: { search, tier, source },
      },
      {
        onSuccess: () => toast.success("Export created"),
        onError: (err: any) => toast.error(err.message),
      }
    );
  };

  const businesses = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="text-muted-foreground">{total} total businesses</p>
        </div>
        <Button onClick={handleExport} disabled={createExport.isPending}>
          <Download className="h-4 w-4 mr-2" />
          Export XLSX
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={tier}
          onValueChange={(v) => {
            setTier(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={source}
          onValueChange={(v) => {
            setSource(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="playwright">Playwright</SelectItem>
            <SelectItem value="places_api">Places API</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setTier("");
            setSource("");
            setPage(1);
          }}
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => {
                      setSortBy("name");
                      setSortDir(sortBy === "name" && sortDir === "asc" ? "desc" : "asc");
                    }}
                  >
                    Business
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  businesses.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <p className="font-medium">{b.name}</p>
                        {b.category && (
                          <p className="text-xs text-muted-foreground">{b.category}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {[b.city, b.state, b.country].filter(Boolean).join(", ") || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {formatRating(b.rating)}
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(b.reviews_count)}</TableCell>
                      <TableCell>
                        <LeadScoreBadge score={b.lead_score} tier={b.quality_tier} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.verification_status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {b.website && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(b.website!, "_blank")}>
                              <Globe className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {b.email && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(`mailto:${b.email}`, "_blank")}>
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {b.phone && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(`tel:${b.phone}`, "_blank")}>
                              <Phone className="h-3.5 w-3.5" />
                            </Button>
                          )}
                                                  </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}