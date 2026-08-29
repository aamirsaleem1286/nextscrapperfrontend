"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { BusinessListItem } from "@/types";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatNumber, formatRating, timeAgo, tierColor, statusColor } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react";

const columnHelper = createColumnHelper<BusinessListItem>();

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  filters: Record<string, any>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
  onFilterChange: (filters: Record<string, any>) => void;
  isLoading?: boolean;
  rowActions?: (row: TData) => React.ReactNode;
  rowKey?: (row: TData) => string;
}

export function DataTable<TData extends { id: string }>({
  columns,
  data,
  total,
  page,
  pageSize,
  sortBy,
  sortDir,
  filters,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  isLoading,
  rowActions,
  rowKey = (r) => r.id,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: [{ id: sortBy, desc: sortDir === "desc" }],
      columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value })),
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater([]) : updater;
      if (newSorting.length > 0) {
        onSortChange(newSorting[0].id, newSorting[0].desc ? "desc" : "asc");
      }
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === "function" ? updater([]) : updater;
      const filterObj: Record<string, any> = {};
      newFilters.forEach((f) => {
        filterObj[f.id] = f.value;
      });
      onFilterChange(filterObj);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(total / pageSize),
    initialState: {
      pagination: { pageIndex: page - 1, pageSize },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page - 1, pageSize });
        onPageChange(newState.pageIndex + 1);
        onPageSizeChange(newState.pageSize);
      }
    },
  });

  const setFilter = (id: string, value: any) => {
    const newFilters = { ...filters, [id]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      {/* Filters toolbar */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={(filters.search || "") as string}
              onChange={(e) => setFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={(filters.tier || "") as string} onValueChange={(v) => setFilter("tier", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tiers</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={(filters.source || "") as string} onValueChange={(v) => setFilter("source", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              <SelectItem value="playwright">Playwright</SelectItem>
              <SelectItem value="places_api">Places API</SelectItem>
            </SelectContent>
          </Select>
          <Select value={(filters.verification_status || "") as string} onValueChange={(v) => setFilter("verification_status", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="auto_verified">Auto Verified</SelectItem>
              <SelectItem value="human_verified">Human Verified</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={clearFilters} disabled={Object.keys(filters).length === 0}>
            <Filter className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "cursor-pointer select-none",
                            header.column.getCanSort() && "hover:bg-muted"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronUp className="h-3.5 w-3.5" />,
                              desc: <ChevronDown className="h-3.5 w-3.5" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                        No businesses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={rowKey(row.original)} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, total)} of {total} results
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => onPageSizeChange(Number(v))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} per page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page * pageSize >= total}
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