"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  currency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  currency = false,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-bg-card border-l-4 border-brand-purple rounded-lg p-4 transition-default hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        {icon && <div className="text-brand-cyan text-xl">{icon}</div>}
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              isPositive ? "text-brand-green" : "text-brand-red"
            }`}
          >
            {isPositive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-text-muted text-xs font-medium uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-text-primary">
        {currency && "$"}
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};
