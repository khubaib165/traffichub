"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store";

import { TrendingUp, Zap, Target, PlusCircle, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { colors } from "@/styles/design-tokens";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  const [stats, setStats] = useState({
    todaySpend: "0",
    todayClicks: "0",
    conversions: "0",
    avgCTR: "0",
  });

  // Calculate time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, []);

  // Fetch real data from Push House API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch campaigns
        const campaignsRes = await fetch("/api/campaigns");
        const campaignsData = await campaignsRes.json();

        // Fetch stats
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();


        // Transform campaigns data for top campaigns
        if (campaignsData.data && Array.isArray(campaignsData.data)) {
          const topThree = campaignsData.data.slice(0, 3).map((campaign: any) => ({
            id: campaign.id || "N/A",
            name: campaign.name || "Unnamed",
            status: campaign.status || "unknown",
            spend: `$${(campaign.spent || 0).toFixed(2)}`,
            clicks: (campaign.clicks || 0).toLocaleString(),
            conversions: (campaign.conversions || 0).toString(),
          }));
          setTopCampaigns(topThree);
        }

        // Transform stats data for chart
        if (statsData.data && Array.isArray(statsData.data)) {
          const chartTransformed = statsData.data.slice(0, 7).map((stat: any, idx: number) => ({
            date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx] || `Day ${idx}`,
            impressions: stat.impressions || 0,
            clicks: stat.clicks || 0,
            conversions: stat.conversions || 0,
            spend: stat.spent || 0,
          }));
          setChartData(chartTransformed);

          // Calculate today's stats
          const dailyStats = campaignsData.data || [];
          const totalSpent = dailyStats.reduce((sum: number, c: any) => sum + (c.spent || 0), 0);
          const totalClicks = dailyStats.reduce((sum: number, c: any) => sum + (c.clicks || 0), 0);
          const totalConversions = dailyStats.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0);
          const totalImpressions = dailyStats.reduce((sum: number, c: any) => sum + (c.impressions || 0), 0);
          const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";

          setStats({
            todaySpend: totalSpent.toFixed(2),
            todayClicks: totalClicks.toLocaleString(),
            conversions: totalConversions.toString(),
            avgCTR: ctr,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  const handleNewCampaign = () => {
    toast.success("Navigating to campaigns page...");
    router.push("/campaigns");
  };

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-1">
                {greeting}, {user?.name || "User"} 👋
              </h1>
              <p className="text-text-secondary">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })} — Your campaigns are running well today
              </p>
            </div>
            <Button 
              variant="primary" 
              icon={<PlusCircle size={16} />}
              onClick={handleNewCampaign}
            >
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Zap className="text-brand-cyan" size={24} />}
            label="Today's Spend"
            value={loading ? "..." : `$${stats.todaySpend}`}
            change={12.4}
            currency
          />
          <StatCard
            icon={<Target className="text-brand-cyan" size={24} />}
            label="Today's Clicks"
            value={loading ? "..." : stats.todayClicks}
            change={8.1}
          />
          <StatCard
            icon={<TrendingUp className="text-brand-green" size={24} />}
            label="Conversions"
            value={loading ? "..." : stats.conversions}
            change={22.5}
          />
          <StatCard
            icon={<BarChart3 className="text-brand-amber" size={24} />}
            label="Avg. CTR"
            value={loading ? "..." : `${stats.avgCTR}%`}
            change={-0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spend & Clicks Chart */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary">
                  Spend & Clicks
                </h2>
                <div className="flex gap-2">
                  {["7d", "14d", "30d"].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 rounded text-xs font-medium transition-default ${
                        period === "7d"
                          ? "bg-brand-purple text-white"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.borderDark} />
                  <XAxis stroke={colors.textMuted} />
                  <YAxis stroke={colors.textMuted} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="spend" fill={colors.brandPurple} />
                  <Bar dataKey="clicks" fill={colors.brandCyan} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Campaigns */}
          <Card>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Top Campaigns
            </h2>
            <div className="space-y-3">
              {topCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 bg-bg-dark rounded-lg">
                  <p className="text-sm font-medium text-text-primary">
                    {campaign.name}
                  </p>
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{campaign.spend}</span>
                    <span>{campaign.clicks} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Network Volume */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Network Volume
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderDark} />
              <XAxis stroke={colors.textMuted} />
              <YAxis stroke={colors.textMuted} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke={colors.brandPurple}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke={colors.brandCyan}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
}


