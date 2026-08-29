"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCreateScrapeJob } from "@/hooks/useJobs";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { JobSource } from "@/types";

const COUNTRIES = [
  "Malaysia",
  "United States",
  "United Kingdom",
  "Australia",
  "Singapore",
  "India",
  "Canada",
  "Other",
];

export function ScrapeForm() {
  const router = useRouter();
  const createJob = useCreateScrapeJob();

  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [maxResults, setMaxResults] = useState(50);
  const [source, setSource] = useState<JobSource>("playwright");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }

    createJob.mutate(
      {
        keyword: keyword.trim(),
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
        max_results: maxResults,
        source,
      },
      {
        onSuccess: () => {
          toast.success("Scrape job created");
          router.refresh();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create scrape job");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          New Scrape
        </CardTitle>
        <CardDescription>
          Search Google Maps for businesses. Enter a keyword and location.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword *</Label>
            <Input
              id="keyword"
              placeholder="eg. Dentist, Restaurant, Plumber"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="Optional"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="eg. Kuala Lumpur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxResults">Maximum Results</Label>
            <Input
              id="maxResults"
              type="number"
              min={1}
              max={500}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Source</Label>
            <Tabs defaultValue="playwright" onValueChange={(v) => setSource(v as JobSource)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="playwright">Browser (Playwright)</TabsTrigger>
                <TabsTrigger value="places_api">Google Places API</TabsTrigger>
                <TabsTrigger value="osm">OpenStreetMap</TabsTrigger>
              </TabsList>
              <TabsContent value="playwright" className="text-sm text-muted-foreground mt-2">
                Uses Playwright automated browser. Handles consent popups, scrolls results, extracts detailed data. Slower but more comprehensive.
              </TabsContent>
              <TabsContent value="places_api" className="text-sm text-muted-foreground mt-2">
                Uses the official Google Places API. Faster and more reliable, but requires a valid API key configured in the backend.
              </TabsContent>
              <TabsContent value="osm" className="text-sm text-muted-foreground mt-2">
                Uses free OpenStreetMap data (Nominatim + Overpass). No API key required, but has no ratings/reviews and coverage varies by region.
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={createJob.isPending}>
            {createJob.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Starting scrape...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Start Scrape
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}