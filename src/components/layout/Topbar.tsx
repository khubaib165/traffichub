"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useNotificationStore, useAuthStore, useWalletStore, useUIStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const Topbar: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { unreadCount } = useNotificationStore();
  const { user } = useAuthStore();
  const { wallet } = useWalletStore();

  return (
    <header className="h-16 bg-bg-surface border-b border-border-dark flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="hidden md:hidden text-text-secondary hover:text-text-primary transition-default"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Balance Chip */}
        {wallet && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green" />
            {formatCurrency(wallet.balance)}
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-default hover:bg-bg-card rounded-lg">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-brand-red rounded-full text-white text-xs font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border-dark">
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-text-primary">{user.name}</p>
              <p className="text-xs text-text-muted capitalize">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

