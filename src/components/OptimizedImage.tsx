import { useState, memo } from "react";

import { useImageOptimization } from "../hooks/useOptimization";
import { getSizeOptimizedImageUrl } from "../utils/cms";
import ImageSkeleton from "./ImageSkeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  size?: "th" | "xs" | "sm" | "md" | "lg";
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  size = "md",
  className = "",
  loading = "lazy",
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  const [currentSrc, setCurrentSrc] = useState(() =>
    getSizeOptimizedImageUrl(src, size)
  );
  const { handleImageLoad, handleImageError } = useImageOptimization();

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState("loaded");
    handleImageLoad(event.nativeEvent);
    onLoad?.();
  };
  const handleErrorWithFallback = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    // First fallback: Try original URL without size optimization
    if (
      currentSrc.includes("_md.") ||
      currentSrc.includes("_lg.") ||
      currentSrc.includes("_sm.") ||
      currentSrc.includes("_xs.") ||
      currentSrc.includes("_th.")
    ) {
      const fallbackSrc = currentSrc.replace(/_[a-z]{2}\./g, ".");
      if (fallbackSrc !== currentSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
    }

    // Second fallback: If we're not already using the original src, try it
    if (currentSrc !== src) {
      setCurrentSrc(src);
      return;
    }

    // Final fallback: Show error state
    setImageState("error");
    handleImageError(event.nativeEvent);
    onError?.();
  };

  const imageClasses = [
    "transition-all duration-300",
    imageState === "loading" ? "opacity-0 blur-sm" : "opacity-100 blur-0",
    imageState === "error" ? "grayscale" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="relative overflow-hidden bg-gray-100 rounded-lg">
      {imageState === "loading" && (
        <ImageSkeleton
          className="absolute inset-0"
          height="100%"
          showIcon={true}
          showText={true}
        />
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding="async"
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleErrorWithFallback}
        style={{
          aspectRatio: "auto",
          maxWidth: "100%",
          height: "auto",
          minHeight: imageState === "loading" ? "200px" : "auto",
        }}
      />

      {imageState === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm min-h-[200px] rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-center">
              <div className="font-medium">Image unavailable</div>
              <div className="text-xs text-gray-400 mt-1">
                Failed to load image
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;
