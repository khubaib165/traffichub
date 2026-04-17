"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Edit2, Trash2, Pause, Play, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "pending" | "rejected" | "draft" | "completed";
  totalBudget?: number;
  dailyBudget?: number;
  stats?: {
    spend: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
  };
  createdAt?: Date | string;
}

interface CampaignForm {
  name: string;
  dailyBudget: string;
  totalBudget: string;
  format: string;
  targeting: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignForm>({
    name: "",
    dailyBudget: "",
    totalBudget: "",
    format: "push-web",
    targeting: "all",
  });

  // Fetch campaigns from Firestore via API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const statusParam = filter !== "all" ? filter : "";
        const url = statusParam ? `/api/campaigns?status=${statusParam}` : "/api/campaigns";
        
        const response = await fetch(url);
        const data = await response.json();

        // Handle both 200 and 500 responses
        if (data.campaigns && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);
          if (data.error) {
            console.warn("API warning:", data.error);
          }
        } else if (!response.ok) {
          throw new Error(data.error || "Failed to fetch campaigns");
        } else {
          setCampaigns([]);
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errMsg);
        console.error("Error fetching campaigns:", err);
        setCampaigns([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [filter]);

  const filteredCampaigns = campaigns.filter((c) => {
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Paused", value: "paused" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  const handleEditCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      setFormData({
        name: campaign.name,
        dailyBudget: String(campaign.dailyBudget || ""),
        totalBudget: String(campaign.totalBudget || ""),
        format: "push-web",
        targeting: "all",
      });
      setEditingCampaignId(campaignId);
      setShowEditModal(true);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaignId || !formData.name || !formData.dailyBudget) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.loading("Updating campaign...");
    try {
      const response = await fetch(`/api/campaigns/${editingCampaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dailyBudget: parseFloat(formData.dailyBudget),
          totalBudget: parseFloat(formData.totalBudget || formData.dailyBudget),
        }),
      });

      if (!response.ok) throw new Error("Failed to update campaign");

      setTimeout(() => {
        toast.dismiss();
        toast.success("Campaign updated successfully!");
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === editingCampaignId
              ? { ...c, name: formData.name, dailyBudget: parseFloat(formData.dailyBudget) }
              : c
          )
        );
        setShowEditModal(false);
        setFormData({ name: "", dailyBudget: "", totalBudget: "", format: "push-web", targeting: "all" });
        setEditingCampaignId(null);
      }, 1200);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to update campaign");
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/pause`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to pause campaign");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, status: "paused" } : c
        )
      );
      toast.success("Campaign paused successfully");
    } catch (err) {
      toast.error("Failed to pause campaign");
      console.error("Error:", err);
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/resume`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to resume campaign");

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, status: "active" } : c
        )
      );
      toast.success("Campaign resumed successfully");
    } catch (err) {
      toast.error("Failed to resume campaign");
      console.error("Error:", err);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete campaign");

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      toast.success("Campaign deleted successfully");
    } catch (err) {
      toast.error("Failed to delete campaign");
      console.error("Error:", err);
    }
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Campaigns</h1>
            <p className="text-text-secondary">Manage and monitor your ad campaigns</p>
          </div>
          <Button 
            variant="primary" 
            icon={<PlusCircle size={16} />}
            onClick={() => router.push("/campaigns/create")}
          >
            New Campaign
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-default ${
                filter === f.value
                  ? "bg-brand-purple text-white"
                  : "bg-bg-card text-text-secondary border border-border-dark hover:border-brand-purple"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Campaigns Table */}
        <Card variant="default">
          {error && (
            <div className="p-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                No campaigns found
              </h3>
              <p className="text-text-muted mb-6">
                Create your first campaign to get started
              </p>
              <Button 
                variant="primary" 
                icon={<PlusCircle size={16} />} 
                onClick={() => router.push("/campaigns/create")}
              >
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th className="text-right">Budget</th>
                    <th className="text-right">Spend</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-t border-border-dark hover:bg-bg-card/50">
                      <td className="py-3 font-medium">{campaign.name}</td>
                      <td>
                        <Badge status={campaign.status} size="sm" />
                      </td>
                      <td className="text-sm text-right text-text-muted">
                        ${campaign.dailyBudget || campaign.totalBudget || 0}
                      </td>
                      <td className="text-sm text-right text-text-muted">
                        ${campaign.stats?.spend || 0}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEditCampaign(campaign.id)}
                            className="p-1.5 text-text-muted hover:text-brand-cyan transition-default rounded hover:bg-bg-card"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          {campaign.status === "active" ? (
                            <button
                              onClick={() => handlePauseCampaign(campaign.id)}
                              className="p-1.5 text-text-muted hover:text-brand-amber transition-default rounded hover:bg-bg-card"
                              title="Pause"
                            >
                              <Pause size={16} />
                            </button>
                          ) : campaign.status === "paused" ? (
                            <button
                              onClick={() => handleResumeCampaign(campaign.id)}
                              className="p-1.5 text-text-muted hover:text-brand-green transition-default rounded hover:bg-bg-card"
                              title="Resume"
                            >
                              <Play size={16} />
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-1.5 text-text-muted hover:text-brand-red transition-default rounded hover:bg-bg-card"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Edit Campaign Modal */}
        {showEditModal && editingCampaignId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Edit Campaign</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 hover:bg-bg-card rounded"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Campaign Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Daily Budget * (USD)
                    </label>
                    <Input
                      type="number"
                      value={formData.dailyBudget}
                      onChange={(e) => setFormData({ ...formData, dailyBudget: e.target.value })}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Total Budget (USD)
                    </label>
                    <Input
                      type="number"
                      value={formData.totalBudget}
                      onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleUpdateCampaign}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
