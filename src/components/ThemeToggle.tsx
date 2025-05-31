import { memo } from "react";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 focus-ring group hover:scale-105 z-50"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-accent-yellow transition-all duration-500 transform ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-180 scale-75 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-accent-purple transition-all duration-500 transform ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-180 scale-75 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-surface border border-border rounded-lg text-xs text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-medium">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-surface border-l border-t border-border rotate-45"></div>
      </div>
    </button>
  );
});

export default ThemeToggle;
