"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeadScoreBadge } from "@/components/shared/lead-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { useBusinessDetail, useBusinessScore } from "@/hooks/useBusinesses";
import { formatNumber, formatRating } from "@/lib/utils";
import {
  Building2,
  Star,
  Phone,
  Shield,
  Cpu,
  Factory,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: business, isLoading } = useBusinessDetail(resolvedParams.id);
  const { data: score } = useBusinessScore(resolvedParams.id);

  if (isLoading || !business) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const b = business;

  const sections = [
    {
      title: "basic",
      label: "Basic Info",
      icon: Building2,
      fields: [
        { label: "Name", value: b.name },
        { label: "Category", value: b.category },
        { label: "Address", value: b.address },
        { label: "City", value: b.city },
        { label: "State", value: b.state },
        { label: "Postal Code", value: b.postal_code },
        { label: "Country", value: b.country },
        { label: "Latitude", value: b.latitude?.toString() },
        { label: "Longitude", value: b.longitude?.toString() },
      ],
    },
    {
      title: "contact",
      label: "Contact",
      icon: Phone,
      fields: [
        { label: "Phone", value: b.phone },
        { label: "Phone (E.164)", value: b.phone_normalized },
        { label: "WhatsApp", value: b.whatsapp, link: b.whatsapp },
        { label: "Email", value: b.email, link: b.email ? `mailto:${b.email}` : undefined },
        { label: "Website", value: b.website, link: b.website },
        { label: "Google Maps", value: b.google_maps_url, link: b.google_maps_url },
      ],
    },
    {
      title: "google",
      label: "Google Profile",
      icon: Star,
      fields: [
        { label: "Rating", value: formatRating(b.rating) },
        { label: "Reviews", value: formatNumber(b.reviews_count) },
        { label: "Status", value: b.business_status },
        { label: "Year Established", value: b.year_established?.toString() },
      ],
    },
    {
      title: "business",
      label: "Details",
      icon: Factory,
      fields: [
        { label: "Industry", value: b.industry },
        { label: "Services", value: b.services?.join(", ") },
        { label: "Brands", value: b.brands?.join(", ") },
        { label: "Company Size", value: b.company_size },
      ],
    },
    {
      title: "social",
      label: "Social Media",
      icon: Facebook,
      fields: [
        { label: "Facebook", value: b.facebook_url, link: b.facebook_url },
        { label: "LinkedIn", value: b.linkedin_url, link: b.linkedin_url },
        { label: "Instagram", value: b.instagram_url, link: b.instagram_url },
        { label: "YouTube", value: b.youtube_url, link: b.youtube_url },
      ],
    },
    {
      title: "intel",
      label: "Website Intel",
      icon: Cpu,
      fields: [
        { label: "SSL Valid", value: b.ssl_valid ? "Yes" : "No", badge: b.ssl_valid ? "green" : "red" },
        { label: "CMS", value: b.cms },
        { label: "Mobile Friendly", value: b.mobile_friendly ? "Yes" : "No" },
        { label: "SEO Score", value: b.seo_score?.toString() },
        { label: "Google Analytics", value: b.has_google_analytics ? "Yes" : "No" },
        { label: "Meta Pixel", value: b.has_meta_pixel ? "Yes" : "No" },
        { label: "Contact Form", value: b.has_contact_form ? "Yes" : "No" },
        { label: "Booking", value: b.has_online_booking ? "Yes" : "No" },
        { label: "Live Chat", value: b.has_live_chat ? "Yes" : "No" },
        { label: "E-commerce", value: b.has_ecommerce ? "Yes" : "No" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{b.name}</h1>
          <p className="text-muted-foreground">{b.category}</p>
        </div>
        <div className="flex items-center gap-3">
          <LeadScoreBadge score={b.lead_score} tier={b.quality_tier} />
          <StatusBadge status={b.verification_status} />
        </div>
      </div>

      {/* Score Breakdown */}
      {score && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Score Breakdown ({score.score}/100)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {score.breakdown.map((item) => (
                <div
                  key={item.criterion}
                  className={cn(
                    "p-4 rounded-lg border",
                    item.earned
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-muted border-border"
                  )}
                >
                  <p className="text-sm font-medium">{item.criterion}</p>
                  <p className="text-xl font-bold text-primary mt-1">
                    {item.earned ? `+${item.points}` : "+0"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <Tabs defaultValue="basic">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 justify-start">
          {sections.map((s) => (
            <TabsTrigger key={s.title} value={s.title} className="rounded-full">
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.title} value={section.title} className="mt-4">
            <Card>
              <CardContent className="p-6">
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field: any) => (
                    <div key={field.label} className="flex flex-col gap-1">
                      <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
                      <dd className="flex items-center gap-2">
                        {field.value ? (
                          <>
                            {field.link ? (
                              <a
                                href={field.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                {field.value}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : field.badge ? (
                              <Badge variant={field.badge === "green" ? "default" : "destructive"}>
                                {field.value}
                              </Badge>
                            ) : (
                              <span>{field.value}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}