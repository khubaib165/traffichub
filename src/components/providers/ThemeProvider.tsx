"use client";

import React from "react";
import { useThemeStore } from "@/lib/store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { setTheme } = useThemeStore();

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme as "dark" | "light");
  }, [setTheme]);

  return <>{children}</>;
};

