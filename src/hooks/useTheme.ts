import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const theme = {
    bg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-white" : "text-black",
    accent: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white" : "border-black",
    hover: isDark
      ? "hover:bg-white hover:text-black"
      : "hover:bg-black hover:text-white",
  };

  return { isDark, setIsDark, theme };
}
