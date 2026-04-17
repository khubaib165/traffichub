"use client";

import React from "react";

interface BadgeProps {
  status: "active" | "paused" | "pending" | "rejected" | "draft" | "completed";
  label?: string;
  size?: "sm" | "md";
}

const statusStyles = {
  active: "bg-brand-green/10 text-brand-green",
  paused: "bg-brand-amber/10 text-brand-amber",
  pending: "bg-brand-purple/10 text-brand-purple",
  rejected: "bg-brand-red/10 text-brand-red",
  draft: "bg-brand-purple/10 text-brand-purple",
  completed: "bg-brand-green/10 text-brand-green",
};

const statusLabels = {
  active: "Active",
  paused: "Paused",
  pending: "Pending Review",
  rejected: "Rejected",
  draft: "Draft",
  completed: "Completed",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export const Badge: React.FC<BadgeProps> = ({ status, label, size = "md" }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        transition-default
        ${statusStyles[status]}
        ${sizeStyles[size]}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label || statusLabels[status]}
    </span>
  );
};
