import { memo, useCallback, useEffect, useState } from "react";
import ContentRenderer from "../components/ContentRenderer";
import { useDiaryContent } from "../hooks/useDiary";
import { updateSEO, updateStructuredData } from "../utils/seo";
import { getDiaryContentSEOAttributes } from "../utils/cms";
import { useNavigate, useParams } from "react-router";
import ErrorPage from "../components/ErrorPage";

import { formatDate } from "../helper/formatDate";
import { DetailPageSkeleton } from "../components/LoadingComponents";

interface DetailPageProps {}

const DetailPage = memo(function DetailPage({}: DetailPageProps) {
  const { id: diaryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showFinalError, setShowFinalError] = useState(false);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [diaryId]);

  const handleBackToHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (!diaryId) {
    return (
      <ErrorPage
        errorType="Not Found"
        message="The page you're looking for doesn't exist or may have been
              removed. You'll be redirected to the home page in a few seconds."
      />
    );
  }

  const {
    data: diary,
    error,
    isLoading,
    refetch,
    failureCount,
  } = useDiaryContent(diaryId);

  useEffect(() => {
    if (error) {
      const isClientError =
        (error as any)?.status >= 400 && (error as any)?.status < 500;
      if (isClientError || failureCount >= 3) {
        setShowFinalError(true);
      }
    } else {
      setShowFinalError(false);
    }
  }, [error, failureCount]);

  useEffect(() => {
    if (diary) {
      const seoData = getDiaryContentSEOAttributes(diary);
      updateSEO(seoData);
      updateStructuredData(seoData);
    }
  }, [diary]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: diary?.meta.title || "Wisata Diary",
      text: diary?.meta.description || "",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [diary]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (showFinalError) {
    return (
      <ErrorPage
        errorType="Connection Failed"
        message="You'll be redirected to the home page in a few seconds."
        setShowFinalError={setShowFinalError}
        refetch={refetch}
      />
    );
  }

  if (error || !diary) {
    return (
      <ErrorPage
        errorType="Not Found"
        message="The page you're looking for doesn't exist or may have been
              removed. You'll be redirected to the home page in a few seconds."
        setShowFinalError={setShowFinalError}
        refetch={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Content */}
        <div className="animate-fade-in">
          <article className="px-4 md:px-6 pt-6 pb-8">
            {/* Article Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
              {diary.meta.title}
            </h1>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full shadow-medium">
                  <img
                    src="/icon.png"
                    alt="Wisata Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Wisata Diary
                  </div>
                  <time
                    dateTime={diary.created_dt}
                    className="text-sm text-foreground-secondary"
                  >
                    {formatDate(diary.created_dt)}
                  </time>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-foreground-secondary hover:text-primary hover:bg-surface rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-em:text-foreground-secondary prose-code:text-primary prose-code:bg-surface prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:bg-surface/50 prose-blockquote:text-foreground-secondary prose-img:rounded-xl">
              <ContentRenderer content={diary.content} />
            </div>
          </article>

          {/* Back to Home */}
          <div className="px-6 pb-8">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center gap-2 w-full py-3 bg-surface hover:bg-surface-hover text-foreground border border-border rounded-2xl font-medium focus-ring hover:cursor-pointer"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to all stories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DetailPage;
