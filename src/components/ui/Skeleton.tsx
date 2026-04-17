"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
}) => {
  const baseClass =
    "bg-gradient-to-r from-bg-card via-bg-surface to-bg-card bg-[length:200%_100%] animate-shimmer";

  const variantClass = {
    text: "rounded h-4 w-3/4",
    circle: "rounded-full w-10 h-10",
    rectangular: "rounded-lg w-full h-12",
  };

  return <div className={`${baseClass} ${variantClass[variant]} ${className}`} />;
};
