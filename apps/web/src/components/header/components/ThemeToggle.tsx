import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "../../../lib/utils";

type Theme = "light" | "system" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "system";
  }

  const root = document.documentElement;

  if (root.classList.contains("light")) {
    return "light";
  }

  if (root.classList.contains("dark")) {
    return "dark";
  }

  return "system";
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }, [ready, theme]);

  return (
    <div
      className="inline-flex items-center rounded-full border-retro border-foreground bg-background p-1 shadow-retro-sm"
      role="group"
      aria-label="Theme selection"
    >
      <div className="relative grid grid-cols-3">
        <span
          aria-hidden="true"
          className={cn(
            "bg-accent absolute inset-y-0 w-[calc(33.333%-0.167rem)] rounded-full border-2 border-foreground transition-transform duration-300 ease-out",
            theme === "light" && "translate-x-0",
            theme === "system" && "translate-toggle-system",
            theme === "dark" && "translate-toggle-dark",
          )}
        />

        <button
          type="button"
          aria-label="Switch to light theme"
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
          className={cn(
            "relative z-10 flex size-10 items-center justify-center rounded-full transition-colors cursor-pointer",
            theme === "light"
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Sun
            className={cn(
              "size-4 transition-transform duration-300 -translate-x-px",
              theme === "light" ? "rotate-0 scale-100" : "-rotate-45 scale-90",
            )}
          />
        </button>

        <button
          type="button"
          aria-label="Use system theme"
          aria-pressed={theme === "system"}
          onClick={() => setTheme("system")}
          className={cn(
            "relative z-10 flex size-10 items-center justify-center rounded-full transition-colors cursor-pointer",
            theme === "system"
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Monitor
            className={cn(
              "size-4 -translate-x-nudge transition-transform duration-300",
              theme === "system" ? "scale-100" : "scale-90",
            )}
          />
        </button>

        <button
          type="button"
          aria-label="Switch to dark theme"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
          className={cn(
            "relative z-10 flex size-10 items-center justify-center rounded-full transition-colors cursor-pointer",
            theme === "dark"
              ? "text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Moon
            className={cn(
              "size-4 -translate-x-nudge transition-transform duration-300",
              theme === "dark" ? "rotate-0 scale-100" : "rotate-45 scale-90",
            )}
          />
        </button>
      </div>
    </div>
  );
};
