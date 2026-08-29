"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { useJobs, usePauseJob, useResumeJob, useCancelJob } from "@/hooks/useJobs";
import { Loader2, Pause, Play, XCircle, RefreshCw } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export function JobsTable() {
  const { data, isLoading, refetch } = useJobs();
  const pause = usePauseJob();
  const resume = useResumeJob();
  const cancel = useCancelJob();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const jobs = data?.items || [];

  if (jobs.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No jobs yet. Create one above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Recent Jobs</h3>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Found</TableHead>
            <TableHead>New</TableHead>
            <TableHead>Dupes</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const isActive = job.status === "running" || job.status === "queued";
            return (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  {job.keyword}
                  {(job.city || job.state || job.country) && (
                    <p className="text-xs text-muted-foreground">
                      {[job.city, job.state, job.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  <div className="w-28">
                    <Progress value={job.progress} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {Math.round(job.progress)}%
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  {job.source === "playwright" ? "Browser" : "API"}
                </TableCell>
                <TableCell>{job.total_found}</TableCell>
                <TableCell className="text-green-600 dark:text-green-400">
                  {job.new_count}
                </TableCell>
                <TableCell className="text-amber-600 dark:text-amber-400">
                  {job.duplicate_count}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {timeAgo(job.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isActive && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => pause.mutate(job.id)}
                          title="Pause"
                        >
                          <Pause className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => cancel.mutate(job.id)}
                          title="Cancel"
                        >
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </>
                    )}
                    {job.status === "paused" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => resume.mutate(job.id)}
                        title="Resume"
                      >
                        <Play className="h-3.5 w-3.5 text-green-500" />
                      </Button>
                    )}
                    {job.error_message && (
                      <p className="text-xs text-red-500 max-w-40 truncate" title={job.error_message}>
                        {job.error_message}
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}