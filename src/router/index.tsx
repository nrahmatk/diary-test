import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";
import Header from "../components/Header";
import ErrorPage from "../components/ErrorPage";

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <Outlet />
    </div>
  );
}

function ErrorHomePage() {
  return (
    <ErrorPage
      errorType="Oops! Something went wrong"
      message="We encountered an error while loading this page."
      autoNavigate={false}
      refetch={() => window.location.reload()}
    />
  );
}

function NotFoundPage() {
  return (
    <ErrorPage
      errorType="Page Not Found"
      message="The diary entry you're looking for doesn't exist. You'll be redirected to the home page in a few seconds."
    />
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorHomePage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "diary/:id",
        element: <DetailPage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Router Provider component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
