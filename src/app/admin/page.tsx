"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
import {
  Users,
  BarChart3,
  AlertTriangle,
  Lock,
  MoreVertical,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "suspended" | "pending";
  verified?: boolean;
  balance?: number;
}

interface Campaign {
  id: string;
  name: string;
  userId: string;
  status: "active" | "pending" | "rejected" | "draft";
  totalBudget?: number;
  stats?: {
    spend: number;
    clicks: number;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "campaigns" | "reports" | "settings">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState({
    commissionRate: 30,
    minBudget: 10,
    maxBudget: 10000,
    enableRegistrations: true,
    maintenanceMode: false,
  });

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch campaigns from Firestore
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns");
        const data = await response.json();
        if (data.campaigns && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
        } else {
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
        // Keep default settings if fetch fails
      }
    };
    loadSettings();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/approve`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to approve user");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: "active", verified: true } : u
        )
      );
      toast.success("User approved");
    } catch (error) {
      toast.error("Failed to approve user");
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/suspend`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to suspend user");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: "suspended" } : u
        )
      );
      toast.success("User suspended");
    } catch (error) {
      toast.error("Failed to suspend user");
    }
  };

  const handleApproveCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/approve`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to approve campaign");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, status: "active" } : c
        )
      );
      toast.success("Campaign approved");
    } catch (error) {
      toast.error("Failed to approve campaign");
    }
  };

  const handleRejectCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: "Rejected by admin" }),
      });
      if (!response.ok) throw new Error("Failed to reject campaign");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, status: "rejected" } : c
        )
      );
      toast.error("Campaign rejected");
    } catch (error) {
      toast.error("Failed to reject campaign");
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete campaign");

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error("Failed to delete campaign");
    }
  };

  const handleSaveSettings = async () => {
    toast.loading("Saving settings...");
    
    try {
      console.log("Saving settings:", settings);
      
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error("Failed to save settings");
      
      const data = await response.json();
      console.log("Settings saved response:", data);
      
      toast.dismiss();
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.dismiss();
      toast.error("Failed to save settings");
    }
  };

  const handleResetSettings = () => {
    setSettings({
      commissionRate: 30,
      minBudget: 10,
      maxBudget: 10000,
      enableRegistrations: true,
      maintenanceMode: false,
    });
    toast.success("Settings reset to default");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-brand-purple" />
            <h1 className="text-4xl font-bold text-text-primary">Admin Dashboard</h1>
          </div>
          <p className="text-text-muted">Manage users, campaigns, and system settings</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Users</p>
                <p className="text-3xl font-bold text-text-primary">1,240</p>
              </div>
              <Users className="w-10 h-10 text-brand-cyan opacity-50" />
            </div>
          </Card>

          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Campaigns</p>
                <p className="text-3xl font-bold text-text-primary">842</p>
              </div>
              <TrendingUp className="w-10 h-10 text-brand-green opacity-50" />
            </div>
          </Card>

          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-brand-amber">28</p>
              </div>
              <Clock className="w-10 h-10 text-brand-amber opacity-50" />
            </div>
          </Card>

          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Flagged Items</p>
                <p className="text-3xl font-bold text-brand-red">5</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-brand-red opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border-dark">
          {[
            { id: "users" as const, label: "Users", icon: Users },
            { id: "campaigns" as const, label: "Campaigns", icon: BarChart3 },
            { id: "reports" as const, label: "Reports", icon: TrendingUp },
            { id: "settings" as const, label: "Settings", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-brand-purple text-brand-purple"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
              <Button variant="primary" size="sm">
                Export Users
              </Button>
            </div>

            {loadingUsers ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} variant="glass" padding="md">
                    <div className="h-12 bg-bg-card rounded animate-pulse" />
                  </Card>
                ))}
              </div>
            ) : users.length === 0 ? (
              <Card variant="glass" padding="md" className="text-center py-8">
                <p className="text-text-muted">No users found</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <Card key={user.id} variant="glass" padding="md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{user.name}</h3>
                          <Badge
                            status={user.status === "suspended" ? "rejected" : (user.status as any)}
                            label={user.status}
                          />
                          {user.verified && (
                            <Badge status="active" label="Verified" />
                          )}
                        </div>
                        <p className="text-sm text-text-muted mb-2">{user.email}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-text-muted">
                            ID: <span className="text-text-primary font-semibold">{user.id}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {user.status !== "active" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {user.status !== "suspended" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <Lock className="w-4 h-4" />
                          </Button>
                        )}
                        <button className="p-2 text-text-muted hover:text-text-primary">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-text-primary">Campaign Moderation</h2>
              <Button variant="primary" size="sm">
                Export Report
              </Button>
            </div>

            {loadingCampaigns ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} variant="glass" padding="md">
                    <div className="h-12 bg-bg-card rounded animate-pulse" />
                  </Card>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <Card variant="glass" padding="md" className="text-center py-8">
                <p className="text-text-muted">No campaigns found</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} variant="glass" padding="md">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{campaign.name}</h3>
                          <Badge
                            status={
                              campaign.status === "active"
                                ? "active"
                                : campaign.status === "rejected"
                                ? "rejected"
                                : ("pending" as any)
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <span className="text-text-muted">
                            User ID: <span className="text-text-primary font-semibold">{campaign.userId}</span>
                          </span>
                          <span className="text-text-muted">
                            Budget: <span className="text-text-primary font-semibold">${campaign.totalBudget}</span>
                          </span>
                          <span className="text-text-muted">
                            Spent: <span className="text-text-primary font-semibold">${campaign.stats?.spend || 0}</span>
                          </span>
                          <span className="text-text-muted">
                            Clicks: <span className="text-text-primary font-semibold">{campaign.stats?.clicks || 0}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {campaign.status === "pending" && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleApproveCampaign(campaign.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectCampaign(campaign.id)}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {campaign.status === "active" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">System Reports</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-bg-surface rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Total Revenue (30 days)</p>
                  <p className="text-3xl font-bold text-brand-green">$123,456</p>
                </div>
                <div className="p-4 bg-bg-surface rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Average Campaign Budget</p>
                  <p className="text-3xl font-bold text-brand-cyan">$542</p>
                </div>
                <div className="p-4 bg-bg-surface rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Total Impressions</p>
                  <p className="text-3xl font-bold text-brand-purple">2.4M</p>
                </div>
                <div className="p-4 bg-bg-surface rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Average CTR</p>
                  <p className="text-3xl font-bold text-brand-amber">3.2%</p>
                </div>
              </div>
              <Button variant="primary" fullWidth>
                Generate Full Report PDF
              </Button>
            </div>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Commission Rate (%)</label>
                <input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-bg-surface border border-border-dark rounded-lg text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Min Campaign Budget ($)</label>
                <input
                  type="number"
                  value={settings.minBudget}
                  onChange={(e) => setSettings({ ...settings, minBudget: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-bg-surface border border-border-dark rounded-lg text-text-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Max Campaign Budget ($)</label>
                <input
                  type="number"
                  value={settings.maxBudget}
                  onChange={(e) => setSettings({ ...settings, maxBudget: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-bg-surface border border-border-dark rounded-lg text-text-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-bg-surface rounded-lg">
                <span className="text-text-primary font-medium">Enable New Registrations</span>
                <input 
                  type="checkbox" 
                  checked={settings.enableRegistrations}
                  onChange={(e) => setSettings({ ...settings, enableRegistrations: e.target.checked })}
                  className="w-5 h-5" 
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-bg-surface rounded-lg">
                <span className="text-text-primary font-medium">Maintenance Mode</span>
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth
                  onClick={handleResetSettings}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
