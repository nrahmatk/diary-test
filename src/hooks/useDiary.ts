import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getDiaryFeed, getDiaryContentById } from "../api/cms";

/**
 * Infinite query for home page diary feed
 * Optimized for infinite scroll with stale-while-revalidate pattern
 */
export function useInfiniteDiaryFeed() {
  return useInfiniteQuery({
    queryKey: ["diary-feed"],
    queryFn: ({ pageParam = 0 }) =>
      getDiaryFeed({ offset: (pageParam as number) * 6, limit: 6 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const totalFetched = pages.length * 6;
      return totalFetched < (lastPage as any).record_count
        ? pages.length
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Single diary content query for detail page
 * Aggressive caching for better UX
 */
export function useDiaryContent(id: string) {
  return useQuery({
    queryKey: ["diary-content", id],
    queryFn: () => getDiaryContentById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Only retry on server errors (5xx) or network errors, max 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Prefetch diary content for improved navigation
 * Call this on hover or intersection for instant loading
 */
export function usePrefetchDiaryContent() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["diary-content", id],
      queryFn: () => getDiaryContentById(id),
      staleTime: 15 * 60 * 1000,
    });
  };
}

import { useQueryClient } from "@tanstack/react-query";
