"use client";

import { ScrapeForm } from "@/components/scrape/scrape-form";
import { JobsTable } from "@/components/scrape/jobs-table";

export default function ScrapePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scrape</h1>
        <p className="text-muted-foreground">
          Create and manage Google Maps scraping jobs
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ScrapeForm />
        <JobsTable />
      </div>
    </div>
  );
}