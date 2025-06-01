import { memo } from "react";

export const DiaryCardSkeleton = memo(function DiaryCardSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-8 h-8 md:h-10 md:w-10 skeleton-loading rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center py-2 gap-2">
          <div className="w-20 h-4 skeleton-loading rounded-full"></div>
          <div className="w-16 h-3 skeleton-loading rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 skeleton-loading rounded-lg w-4/5"></div>
          <div className="h-4 skeleton-loading rounded-lg w-3/4"></div>
          <div className="h-4 skeleton-loading rounded-lg w-2/3"></div>
        </div>
        <div className="h-48 skeleton-loading rounded-2xl"></div>
      </div>
    </div>
  );
});

export const DetailPageSkeleton = memo(function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="p-6 space-y-8 animate-pulse">
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="w-full h-8 skeleton-loading rounded"></div>
            <div className="w-3/4 h-8 skeleton-loading rounded"></div>
          </div>

          {/* Author info skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 skeleton-loading rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 skeleton-loading rounded"></div>
              <div className="w-24 h-3 skeleton-loading rounded"></div>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="w-full h-4 skeleton-loading rounded"></div>
            <div className="w-5/6 h-4 skeleton-loading rounded"></div>
          </div>

          {/* Image skeleton */}
          <div className="w-full h-64 skeleton-loading rounded-2xl"></div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full h-4 skeleton-loading rounded"></div>
                <div className="w-full h-4 skeleton-loading rounded"></div>
                <div className="w-3/4 h-4 skeleton-loading rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const LoadingSpinner = memo(function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-border border-t-accent-blue`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
});
