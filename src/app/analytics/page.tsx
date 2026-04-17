"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colors } from "@/styles/design-tokens";
import { TrendingUp, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [activeMetrics, setActiveMetrics] = useState<string[]>([
    "impressions",
    "clicks",
    "conversions",
  ]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [dimensionData, setDimensionData] = useState<any>({ country: [] });
  const [loading, setLoading] = useState(true);

  // Fetch real analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        // Fetch stats
        const statsRes = await fetch("/api/stats");
        const statsData = await statsRes.json();

        // Fetch country traffic
        const trafficRes = await fetch("/api/traffic?type=country");
        const trafficData = await trafficRes.json();

        // Transform stats data for chart
        if (statsData.data && Array.isArray(statsData.data)) {
          const transformed = statsData.data.slice(0, 7).map((stat: any, idx: number) => ({
            date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx] || `Day ${idx}`,
            impressions: stat.impressions || 0,
            clicks: stat.clicks || 0,
            conversions: stat.conversions || 0,
            spend: stat.spent || 0,
          }));
          setChartData(transformed);
        }

        // Transform country traffic data
        if (trafficData.data && Array.isArray(trafficData.data)) {
          const total = trafficData.data.reduce((sum: number, item: any) => sum + (item.volume || 0), 0);
          const countryData = trafficData.data.slice(0, 5).map((country: any) => {
            const percent = total > 0 ? ((country.volume / total) * 100).toFixed(1) : "0";
            return {
              name: country.country || "Unknown",
              value: country.volume || 0,
              percent: `${percent}%`,
            };
          });
          setDimensionData({ country: countryData });
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Filter chart data based on date range
  const getFilteredData = () => {
    if (dateRange === "7d") return chartData.slice(-7);
    if (dateRange === "14d") return chartData.slice(-14);
    if (dateRange === "30d") return chartData.slice(-30);
    return chartData;
  };

  const filteredChartData = getFilteredData();

  const metrics = [
    { key: "impressions", label: "Impressions", color: colors.brandPurple },
    { key: "clicks", label: "Clicks", color: colors.brandCyan },
    { key: "conversions", label: "Conversions", color: colors.brandGreen },
  ];

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const handleExportReport = () => {
    toast.loading("Generating report...");
    
    setTimeout(() => {
      toast.dismiss();
      // Create CSV data
      const headers = ["Date", "Impressions", "Clicks", "Conversions", "Spend"];
      const csvContent = [
        headers.join(","),
        ...filteredChartData.map((row) =>
          [row.date, row.impressions, row.clicks, row.conversions, row.spend].join(",")
        ),
      ].join("\n");

      // Create and download file
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
      element.setAttribute("download", `analytics_${new Date().toISOString().split("T")[0]}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success("Report exported successfully!");
    }, 1200);
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Analytics
            </h1>
            <p className="text-text-secondary">
              Real-time performance metrics across your campaigns
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div>

        {/* Date Range & Metrics Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            {["7d", "14d", "30d"].map((period) => (
              <button
                key={period}
                onClick={() => setDateRange(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-default ${
                  dateRange === period
                    ? "bg-brand-purple text-white"
                    : "text-text-secondary hover:text-text-primary bg-bg-card border border-border-dark"
                }`}
              >
                Last {period === "7d" ? "7 days" : period === "14d" ? "14 days" : "30 days"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-default ${
                  activeMetrics.includes(metric.key)
                    ? "bg-current text-white"
                    : "bg-bg-card text-text-secondary border border-border-dark"
                }`}
                style={
                  activeMetrics.includes(metric.key)
                    ? { backgroundColor: metric.color }
                    : {}
                }
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <Card variant="glass" className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Campaign Performance
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredChartData}>
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
              {activeMetrics.includes("impressions") && (
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke={colors.brandPurple}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {activeMetrics.includes("clicks") && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke={colors.brandCyan}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {activeMetrics.includes("conversions") && (
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke={colors.brandGreen}
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Dimensions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* By Country */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Performance by Country
            </h3>
            <div className="space-y-4">
              {dimensionData.country.map((country, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      {country.name}
                    </span>
                    <span className="text-xs text-text-muted">{country.percent}</span>
                  </div>
                  <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all"
                      style={{ width: country.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-bg-dark rounded-lg">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Total Impressions
                </p>
                <p className="text-2xl font-bold text-text-primary">2.4M</p>
                <p className="text-xs text-brand-green mt-1">+12.5% vs last period</p>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Average CTR
                </p>
                <p className="text-2xl font-bold text-text-primary">2.3%</p>
                <p className="text-xs text-brand-red mt-1">-0.5% vs last period</p>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Total Spend
                </p>
                <p className="text-2xl font-bold text-text-primary">$3,249.50</p>
                <p className="text-xs text-brand-green mt-1">+8.2% vs last period</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dimension Tabs */}
        <Card>
          <div className="flex gap-2 mb-6 border-b border-border-dark">
            {["Day", "Country", "Device", "OS", "Browser"].map((tab) => (
              <button
                key={tab}
                className="px-4 py-3 text-sm font-medium text-text-secondary border-b-2 border-transparent hover:text-text-primary hover:border-brand-purple transition-default"
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="text-text-muted">Select a dimension to view detailed breakdown</p>
        </Card>
      </div>
    </Layout>
  );
}
