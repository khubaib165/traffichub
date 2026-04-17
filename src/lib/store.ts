import { create } from "zustand";
import { User, Campaign, Wallet, Notification } from "./types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

interface CampaignStore {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  setCampaigns: (campaigns: Campaign[]) => void;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  setIsLoading: (loading: boolean) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  removeCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  campaigns: [],
  currentCampaign: null,
  isLoading: true,
  setCampaigns: (campaigns) => set({ campaigns }),
  setCurrentCampaign: (currentCampaign) => set({ currentCampaign }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),
  updateCampaign: (campaign) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === campaign.id ? campaign : c)),
      currentCampaign:
        state.currentCampaign?.id === campaign.id ? campaign : state.currentCampaign,
    })),
  removeCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      currentCampaign:
        state.currentCampaign?.id === id ? null : state.currentCampaign,
    })),
}));

interface WalletStore {
  wallet: Wallet | null;
  isLoading: boolean;
  setWallet: (wallet: Wallet | null) => void;
  setIsLoading: (loading: boolean) => void;
  updateBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  isLoading: true,
  setWallet: (wallet) => set({ wallet }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateBalance: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? {
            ...state.wallet,
            balance: state.wallet.balance + amount,
          }
        : null,
    })),
}));

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAsRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification || notification.read) return state;
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));

interface ThemeStore {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    }),
}));

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
}));
