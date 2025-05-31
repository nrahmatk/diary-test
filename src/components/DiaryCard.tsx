import React, { memo, useCallback } from "react";
import { Link } from "react-router";
import OptimizedImage from "./OptimizedImage";
import type { DiaryContent } from "../types";

interface DiaryCardProps {
  diary: DiaryContent;
  index: number;
  key?: number;
}

const DiaryCard = memo(function DiaryCard({
  diary,
  index,
  key,
}: DiaryCardProps) {
  const handleShare = useCallback((diary: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: diary.meta.title,
        text: diary.meta.description,
        url: window.location.origin + "/diary/" + diary.id,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + "/diary/" + diary.id
      );
    }
  }, []);

  return (
    <div
      className="group block px-6 pt-4 rounded-2xl mx-2 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
      key={key}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full shadow-medium">
          <img
            src="/icon.png"
            alt="Wisata Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Wisata Diary</span>
              <span className="text-foreground-tertiary">·</span>
              <time
                dateTime={diary.created_dt}
                className="text-foreground-secondary text-sm"
              >
                {new Date(diary.created_dt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>

            {/* Share Button */}
            <button
              onClick={(e) => handleShare(diary, e)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-background hover:bg-accent text-foreground-secondary hover:text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 z-10 transition-transform"
              title="Share this post"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          </div>

          {/* Clickable Content Area */}
          <Link to={`/diary/${diary.id}`} className="block">
            <div className="text-foreground mb-4">
              <div className="font-semibold text-xl mb-2 group-hover:text-primary">
                {diary.meta.title}
              </div>
              <div className="text-foreground-secondary leading-relaxed">
                {diary.meta.description ||
                  diary.content.replace(/<[^>]*>/g, "").slice(0, 200) + "..."}
              </div>
            </div>

            {/* Image */}
            {diary.meta.image && (
              <div className="rounded-2xl overflow-hidden border border-border mb-2 shadow-soft group-hover:shadow-medium">
                <OptimizedImage
                  src={diary.meta.image}
                  alt={diary.meta.title}
                  size="md"
                  className="w-full h-auto object-cover group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
});

export default DiaryCard;
