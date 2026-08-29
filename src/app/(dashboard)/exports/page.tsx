"use client";

import { useState } from "react";
import { useExports } from "@/hooks/useExports";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadExport } from "@/services/exports.service";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";

export default function ExportsPage() {
  const { data, isLoading, refetch } = useExports();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(id: string, fileName?: string) {
    try {
      setDownloadingId(id);
      await downloadExport(id, fileName);
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloadingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading exports...
      </div>
    );
  }

  const exports = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exports</h1>
          <p className="text-muted-foreground">Download your scraped business data</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Format</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No exports yet.
                </TableCell>
              </TableRow>
            ) : (
              exports.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        exp.export_type === "csv" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        exp.export_type === "xlsx" && "bg-green-500/10 text-green-600 dark:text-green-400",
                        exp.export_type === "json" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                        exp.export_type === "sql" && "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {exp.export_type?.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{exp.file_name}</TableCell>
                  <TableCell>{exp.row_count}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        exp.status === "completed" && "bg-green-500/10 text-green-600 dark:text-green-400",
                        exp.status === "failed" && "bg-red-500/10 text-red-600 dark:text-red-400",
                        (exp.status === "running" || exp.status === "queued") &&
                          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      )}
                    >
                      {exp.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(exp.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {exp.status === "completed" ? (
                      <button
                        onClick={() => handleDownload(exp.id, exp.file_name)}
                        disabled={downloadingId === exp.id}
                        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingId === exp.id ? "Downloading..." : "Download"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}