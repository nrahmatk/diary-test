import { memo } from "react";
import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle";

const Header = memo(function Header() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center bg-surface glass-effect border-b border-border px-4 py-3">
      <div className="flex-1 max-w-3xl flex items-center justify-between">
        <Link to={"/"} className="flex items-center gap-2">
          <div className="w-14">
            <img
              src="/logo-01.svg"
              alt="Wisata Logo"
              className="text-white object-contain rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Wisata Diary</h1>
            <p className="text-xs text-foreground-secondary">
              Explore the world
            </p>
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
});

export default Header;
