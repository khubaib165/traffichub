"use client";

import React from "react";
import {
  Bell,
  Home,
  Zap,
  TrendingUp,
  Wallet,
  Users,
  LogOut,
  X,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore, useThemeStore, useAuthStore } from "@/lib/store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  divider?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home size={20} />,
    },
    {
      label: "Campaigns",
      href: "/campaigns",
      icon: <Zap size={20} />,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Networks",
      href: "/networks",
      icon: <Wallet size={20} />,
    },
    {
      label: "Wallet",
      href: "/wallet",
      icon: <Bell size={20} />,
    },
    {
      label: "Partners",
      href: "/partners",
      icon: <Users size={20} />,
    },
    {
      label: "Admin",
      href: "/admin",
      icon: <Lock size={20} />,
      divider: true,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-bg-surface border-r border-border-dark
          transition-all duration-300 z-50 md:relative md:z-0
          ${sidebarOpen ? "w-64" : "w-0 md:w-20"}
          md:w-64 overflow-hidden
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border-dark">
          <div
            className={`flex items-center gap-2 transition-opacity ${
              !sidebarOpen ? "opacity-0 md:opacity-100" : ""
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-text-primary">TrafficFlow</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-6 px-3 space-y-2 flex-1">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-4">
            {sidebarOpen ? "Main" : ""}
          </div>
          {navItems.map((item) => (
            <React.Fragment key={item.href}>
              {item.divider && <div className="h-px bg-border-dark my-2" />}
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg
                  transition-default whitespace-nowrap
                  ${
                    isActive(item.href)
                      ? "bg-brand-purple/20 text-brand-purple border-l-2 border-brand-purple"
                      : "text-text-secondary hover:text-text-primary"
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                {item.icon}
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border-dark p-3 space-y-3">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center py-2 rounded-lg transition-default ${
              sidebarOpen
                ? "text-text-secondary hover:text-text-primary"
                : "text-text-secondary hover:text-brand-cyan"
            }`}
            title="Toggle theme"
          >
            <span className="text-sm">
              {theme === "dark" ? "☀️" : "🌙"}
            </span>
          </button>
          {user && (
            <div
              className={`flex items-center gap-2 p-2 rounded-lg bg-bg-card ${
                !sidebarOpen ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-text-muted truncate capitalize">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => logout()}
            className={`w-full flex items-center ${
              sidebarOpen ? "gap-2 px-3" : "justify-center"
            } py-2 text-text-secondary hover:text-brand-red transition-default rounded-lg`}
            title="Logout"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
