"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className = "", ...props }, ref) => {
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 ${icon ? "pl-10" : ""}
              bg-bg-card border border-border-dark
              rounded-md text-text-primary
              placeholder-text-muted
              transition-default
              focus:outline-none focus:border-brand-purple focus:shadow-glow-purple
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-brand-red" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-brand-red mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
