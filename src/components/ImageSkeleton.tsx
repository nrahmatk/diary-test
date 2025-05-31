import { memo } from "react";

interface ImageSkeletonProps {
  className?: string;
  height?: string | number;
  showIcon?: boolean;
  showText?: boolean;
}

const ImageSkeleton = memo(function ImageSkeleton({
  className = "",
  height = "200px",
  showIcon = true,
  showText = true,
}: ImageSkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}
      style={{ height }}
    >
      {/* Shimmer background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

      {/* Content overlay */}
      {(showIcon || showText) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2 z-10">
            {showIcon && (
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            {showText && (
              <div className="text-gray-500 text-xs font-medium">
                Loading image...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ImageSkeleton;
