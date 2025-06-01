import { memo } from "react";
import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";

const Header = memo(function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/95 border-b border-border backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="h-10 w-10 flex-shrink-0">
              <img
                src="/logo-01.svg"
                alt="Wisata Logo"
                className="h-full w-full object-contain rounded-xl"
                loading="lazy"
                width="40"
                height="40"
              />
            </div>
            <div className="block">
              <h1 className="text-lg font-semibold text-foreground">
                Wisata Diary
              </h1>
              <p className="text-xs text-foreground-secondary">
                Explore the world
              </p>
            </div>
          </Link>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});

export default Header;