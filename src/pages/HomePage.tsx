import React, { memo } from "react";
import { useInfiniteDiaryFeed } from "../hooks/useDiary";
import { useInfiniteScroll } from "../hooks/useOptimization";
import { updateSEO } from "../utils/seo";
import ErrorPage from "../components/ErrorPage";
import DiaryCard from "../components/DiaryCard";
import { DiaryCardSkeleton } from "../components/LoadingComponents";

interface HomePageProps {}

const HomePage = memo(function HomePage({}: HomePageProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteDiaryFeed();

  // Set up infinite scroll
  const { ref: sentinelRef } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  // Update SEO for home page
  React.useEffect(() => {
    updateSEO({
      title: "Wisata Diary - Explore Amazing Places",
      description:
        "Discover amazing travel destinations, hidden gems, and travel tips from around the world. Your ultimate guide to wanderlust and adventure.",
      type: "website",
      language: "id-id",
      url: window.location.href,
      keywords: [
        "wisata",
        "travel",
        "diary",
        "destinasi",
        "liburan",
        "adventure",
      ],
    });
  }, []);

  const allDiaries = data?.pages.flatMap((page) => page.content) || [];

  if (error) {
    return (
      <ErrorPage
        errorType="Something went wrong"
        message="Unable to load content. Please try again."
        refetch={refetch}
        autoNavigate={false}
      />
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        {" "}
        {/* Content */}
        {allDiaries.length === 0 && isFetching ? (
          // Loading skeletons with elegant design
          <div className="space-y-1">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`skeleton-${i}`}
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <DiaryCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Posts Feed */}
            <div className="space-y-1">
              {allDiaries.map((diary, index) => (
                <DiaryCard key={diary.id} diary={diary} index={index} />
              ))}
            </div>

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <div className="p-8 text-center">
                <div className="w-6 h-6 mx-auto border-2 border-border border-t-primary rounded-full animate-spin"></div>
                <p className="text-foreground-secondary mt-2 text-sm">
                  Loading more posts...
                </p>
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="h-4 flex items-center justify-center opacity-0"
                aria-hidden="true"
              >
                {/* Invisible sentinel for better UX */}
              </div>
            )}

            {/* End of Content */}
            {!hasNextPage && allDiaries.length > 0 && (
              <div className="p-8 text-center">
                <div className="text-foreground-secondary text-sm flex items-center justify-center gap-2">
                  <span>✨ You've caught up! All posts loaded</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default HomePage;
