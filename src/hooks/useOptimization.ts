import { useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";

/**
 * Optimized infinite scroll hook using Intersection Observer
 * Triggers fetchNextPage when sentinel element comes into view
 */
export function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold = 0.1,
  rootMargin = "200px", // Increased for better preloading
}: {
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  threshold?: number;
  rootMargin?: string;
}) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false, // Allow multiple triggers
  });

  // Debounced fetch to prevent rapid successive calls
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 100); // 100ms debounce
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (inView) {
      debouncedFetch();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inView, debouncedFetch]);

  return { ref, inView };
}

/**
 * Image lazy loading with error handling and optimization
 */
export function useImageOptimization() {
  const handleImageLoad = useCallback((event: Event) => {
    const img = event.target as HTMLImageElement;
    img.classList.add("loaded");
  }, []);
  const handleImageError = useCallback((event: Event) => {
    const img = event.target as HTMLImageElement;

    // Try fallback without size optimization for Wisata CDN
    if (
      img.src.includes("_md.") ||
      img.src.includes("_lg.") ||
      img.src.includes("_sm.") ||
      img.src.includes("_xs.") ||
      img.src.includes("_th.")
    ) {
      const fallbackSrc = img.src.replace(/_[a-z]{2}\./g, ".");
      if (img.src !== fallbackSrc) {
        img.src = fallbackSrc;
        return;
      }
    }

    // Ultimate fallback placeholder
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
    img.classList.add("error");
  }, []);

  return {
    handleImageLoad,
    handleImageError,
  };
}
