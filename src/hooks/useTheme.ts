import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "auto";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("auto");

  // load saved
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  // apply theme
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}