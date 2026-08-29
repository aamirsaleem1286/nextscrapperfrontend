"use client";

import { useQuery } from "@tanstack/react-query";
import { businessesService, BusinessQueryParams } from "@/services/businesses.service";

export function useBusinesses(params: BusinessQueryParams = {}) {
  return useQuery({
    queryKey: ["businesses", params],
    queryFn: () => businessesService.list(params),
  });
}

export function useBusinessDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => businessesService.get(id!),
    enabled: !!id,
  });
}

export function useBusinessScore(id: string | undefined) {
  return useQuery({
    queryKey: ["businessScore", id],
    queryFn: () => businessesService.score(id!),
    enabled: !!id,
  });
}