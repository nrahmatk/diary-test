import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingComponents";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppRouter } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error("App Error:", error, errorInfo);
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Suspense
            fallback={
              <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <AppRouter />
          </Suspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
