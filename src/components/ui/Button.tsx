"use client";

import React from "react";
import { useThemeStore } from "@/lib/store";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:opacity-90 active:scale-95",
  secondary:
    "bg-bg-card border border-border-dark text-text-primary hover:border-brand-purple active:scale-95",
  danger: "bg-brand-red text-white hover:opacity-90 active:scale-95",
  ghost: "text-brand-cyan hover:bg-bg-card active:scale-95",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs font-medium rounded",
  md: "px-4 py-2 text-sm font-medium rounded-md",
  lg: "px-6 py-3 text-base font-semibold rounded-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`
          inline-flex items-center justify-center gap-2
          transition-default font-inter
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {icon && !isLoading && <span className="flex items-center justify-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
