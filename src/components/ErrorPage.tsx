import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

interface ErrorPageProps {
  errorType?: string;
  message?: string;
  setShowFinalError?: (value: boolean) => void;
  refetch?: () => void;
  autoNavigate?: boolean;
}

const ErrorPage = ({
  errorType,
  message,
  setShowFinalError,
  refetch,
  autoNavigate = true,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (autoNavigate) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoNavigate, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {errorType ? errorType : "Not Found"}
          </h3>
          <p className="text-foreground-secondary mb-4">
            {message
              ? message
              : "You'll be redirected to the home page in a few seconds."}
          </p>
          {autoNavigate && (
            <div className="flex items-center justify-center gap-2 text-sm text-foreground-secondary mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <span className="ml-2">Redirecting...</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {refetch && (
              <button
                onClick={() => {
                  setShowFinalError && setShowFinalError(false);
                  refetch();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-full font-medium focus-ring shadow-medium cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            )}
            {autoNavigate && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover text-foreground border border-border rounded-full font-medium focus-ring cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
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
                Go Home Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
