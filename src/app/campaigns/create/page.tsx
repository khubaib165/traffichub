"use client";

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CampaignData {
  name: string;
  trafficType: string;
  formats: string[];
  targetUrl: string;
  category: string;
  payModel: string;
  pushHouseTraffic: boolean;
  partnerTraffic: boolean;
  country: string;
  city: string;
  zone: string;
  minCpc: string;
  maxCpc: string;
  deviceTargeting: string[];
  osTargeting: string[];
  browserTargeting: string[];
  dailyBudget: string;
  totalBudget: string;
  dailyClicksLimit: string;
  campaignStartDate: string;
  campaignEndDate: string;
  bannerName: string;
  bannerSize: string;
  offerCategory: string;
  conversionType: string;
}

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState<CampaignData>({
    name: "",
    trafficType: "all",
    formats: ["push"],
    targetUrl: "",
    category: "",
    payModel: "cpc",
    pushHouseTraffic: true,
    partnerTraffic: false,
    country: "united-states",
    city: "",
    zone: "",
    minCpc: "",
    maxCpc: "",
    deviceTargeting: ["desktop", "mobile"],
    osTargeting: [],
    browserTargeting: [],
    dailyBudget: "",
    totalBudget: "",
    dailyClicksLimit: "",
    campaignStartDate: "",
    campaignEndDate: "",
    bannerName: "",
    bannerSize: "300x250",
    offerCategory: "",
    conversionType: "all",
  });

  const [selectedFormats, setSelectedFormats] = useState<string[]>(["push"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formats = [
    { id: "push", label: "Push Notification", icon: "🔔" },
    { id: "inpage", label: "In-Page", icon: "📄" },
    { id: "onclick", label: "OnClick", icon: "👆" },
    { id: "banner", label: "Banner", icon: "🖼️" },
  ];

  const countries = [
    { id: "united-states", label: "United States" },
    { id: "united-kingdom", label: "United Kingdom" },
    { id: "canada", label: "Canada" },
    { id: "australia", label: "Australia" },
  ];

  const devices = ["Desktop", "Mobile", "Tablet"];
  const osOptions = ["Windows", "macOS", "iOS", "Android", "Linux"];
  const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
  const bannerSizes = ["300x250", "728x90", "160x600", "300x600", "970x250"];
  const categories = [
    "Mainstream",
    "Adult (18+)",
    "Dating",
    "Finance",
    "Nutra",
    "VPN",
  ];

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const toggleCheckbox = (
    category: "deviceTargeting" | "osTargeting" | "browserTargeting",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.targetUrl || !formData.dailyBudget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating campaign...");

    try {
      const campaignPayload = {
        name: formData.name,
        trafficType: formData.trafficType,
        formats: selectedFormats,
        targetUrl: formData.targetUrl,
        category: formData.category,
        payModel: formData.payModel,
        sources: {
          pushHouse: formData.pushHouseTraffic,
          partners: formData.partnerTraffic,
        },
        targeting: {
          country: formData.country,
          city: formData.city,
          zone: formData.zone,
          devices: formData.deviceTargeting,
          os: formData.osTargeting,
          browsers: formData.browserTargeting,
        },
        bidding: {
          model: formData.payModel,
          minCpc: parseFloat(formData.minCpc) || 0,
          maxCpc: parseFloat(formData.maxCpc) || 0.50,
        },
        budget: {
          daily: parseFloat(formData.dailyBudget),
          total: parseFloat(formData.totalBudget) || null,
          dailyClicksLimit: parseFloat(formData.dailyClicksLimit) || null,
        },
        schedule: {
          startDate: formData.campaignStartDate || new Date().toISOString(),
          endDate: formData.campaignEndDate || null,
        },
        creative: {
          name: formData.bannerName,
          size: formData.bannerSize,
          category: formData.offerCategory,
        },
        conversionType: formData.conversionType,
      };

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to create campaign");
      }

      const data = await response.json();

      setTimeout(() => {
        toast.dismiss();
        toast.success("Campaign created successfully! 🎉");
        // Reset form
        setFormData({
          name: "",
          trafficType: "all",
          formats: ["push"],
          targetUrl: "",
          category: "",
          payModel: "cpc",
          pushHouseTraffic: true,
          partnerTraffic: false,
          country: "united-states",
          city: "",
          zone: "",
          minCpc: "",
          maxCpc: "",
          deviceTargeting: ["desktop", "mobile"],
          osTargeting: [],
          browserTargeting: [],
          dailyBudget: "",
          totalBudget: "",
          dailyClicksLimit: "",
          campaignStartDate: "",
          campaignEndDate: "",
          bannerName: "",
          bannerSize: "300x250",
          offerCategory: "",
          conversionType: "all",
        });
        setSelectedFormats(["push"]);
      }, 1200);
    } catch (err) {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create a Campaign</h1>
          <p className="text-text-secondary">Configure your advertising campaign with Push House</p>
        </div>

        <div className="space-y-6">
          {/* Campaign Details */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Campaign Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Campaign Name * (Available: 30 from 30)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Example-GD2Website-Traffic"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Traffic Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded text-text-primary focus:border-brand-purple outline-none"
                  value={formData.trafficType}
                  onChange={(e) => setFormData({ ...formData, trafficType: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="tier1">Tier 1</option>
                  <option value="tier2">Tier 2</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Ad Format Selection */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Choose Ad Formats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => toggleFormat(format.id)}
                  className={`p-4 rounded-lg border-2 transition-default text-center ${
                    selectedFormats.includes(format.id)
                      ? "border-brand-cyan bg-brand-cyan/10"
                      : "border-border-dark bg-bg-dark hover:border-brand-purple"
                  }`}
                >
                  <div className="text-3xl mb-2">{format.icon}</div>
                  <div className="text-sm font-medium text-text-primary">{format.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* URL & Category */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">URL & Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Target page *
                </label>
                <Input
                  type="url"
                  placeholder="http://www.example.com/c/pbn2qbd4d"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                />
                <p className="text-xs text-brand-amber mt-1 flex gap-1">
                  <AlertCircle size={12} className="mt-0.5" />
                  Please ensure landing page meets Push House requirements
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Offer Category
                </label>
                <select
                  className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded text-text-primary focus:border-brand-purple outline-none"
                  value={formData.offerCategory}
                  onChange={(e) => setFormData({ ...formData, offerCategory: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Pay Model & Traffic Settings */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Pay Model & Traffic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Pay Model
                </label>
                <div className="flex gap-2">
                  {["cpc", "cpm"].map((model) => (
                    <button
                      key={model}
                      onClick={() => setFormData({ ...formData, payModel: model })}
                      className={`px-4 py-2 rounded font-medium transition-default ${
                        formData.payModel === model
                          ? "bg-brand-green text-white"
                          : "bg-bg-dark border border-border-dark text-text-secondary"
                      }`}
                    >
                      {model.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  CPC: Cost per 1000 impressions. Advertiser pays when user views the ad.
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pushHouseTraffic}
                  onChange={(e) => setFormData({ ...formData, pushHouseTraffic: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-text-primary">Push House traffic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.partnerTraffic}
                  onChange={(e) => setFormData({ ...formData, partnerTraffic: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-text-primary">Partner's traffic</span>
              </label>
            </div>
          </Card>

          {/* Targeting */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Targeting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Country</label>
                <select
                  className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded text-text-primary focus:border-brand-purple outline-none"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">City</label>
                <Input
                  placeholder="Optional"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Zone</label>
                <Input
                  placeholder="Optional"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Min CPC ($)</label>
                <Input
                  type="number"
                  placeholder="0.01"
                  step="0.01"
                  value={formData.minCpc}
                  onChange={(e) => setFormData({ ...formData, minCpc: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Max CPC ($)</label>
                <Input
                  type="number"
                  placeholder="0.50"
                  step="0.01"
                  value={formData.maxCpc}
                  onChange={(e) => setFormData({ ...formData, maxCpc: e.target.value })}
                />
              </div>
            </div>

            {/* Device Targeting */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-primary mb-3">Devices</label>
              <div className="flex flex-wrap gap-2">
                {devices.map((device) => (
                  <button
                    key={device}
                    onClick={() => toggleCheckbox("deviceTargeting", device.toLowerCase())}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-default ${
                      formData.deviceTargeting.includes(device.toLowerCase())
                        ? "bg-brand-purple text-white"
                        : "bg-bg-dark border border-border-dark text-text-secondary"
                    }`}
                  >
                    {device}
                  </button>
                ))}
              </div>
            </div>

            {/* OS Targeting */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-3">Operating System</label>
              <div className="flex flex-wrap gap-2">
                {osOptions.map((os) => (
                  <button
                    key={os}
                    onClick={() => toggleCheckbox("osTargeting", os.toLowerCase())}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-default ${
                      formData.osTargeting.includes(os.toLowerCase())
                        ? "bg-brand-purple text-white"
                        : "bg-bg-dark border border-border-dark text-text-secondary"
                    }`}
                  >
                    {os}
                  </button>
                ))}
              </div>
            </div>

            {/* Browser Targeting */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-3">Browser</label>
              <div className="flex flex-wrap gap-2">
                {browsers.map((browser) => (
                  <button
                    key={browser}
                    onClick={() => toggleCheckbox("browserTargeting", browser.toLowerCase())}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-default ${
                      formData.browserTargeting.includes(browser.toLowerCase())
                        ? "bg-brand-purple text-white"
                        : "bg-bg-dark border border-border-dark text-text-secondary"
                    }`}
                  >
                    {browser}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Budget & Limits */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Budget & Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Daily Campaign Budget * (USD)
                </label>
                <Input
                  type="number"
                  placeholder="50"
                  step="0.01"
                  value={formData.dailyBudget}
                  onChange={(e) => setFormData({ ...formData, dailyBudget: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Total Campaign Budget* (USD)
                </label>
                <Input
                  type="number"
                  placeholder="Leave blank for unlimited"
                  step="0.01"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Daily Clicks Limit
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  step="1"
                  value={formData.dailyClicksLimit}
                  onChange={(e) => setFormData({ ...formData, dailyClicksLimit: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Campaign Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.campaignStartDate}
                  onChange={(e) => setFormData({ ...formData, campaignStartDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.campaignEndDate}
                  onChange={(e) => setFormData({ ...formData, campaignEndDate: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Creative Details */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Advertisement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Banner Name</label>
                <Input
                  placeholder="e.g., Main Banner"
                  value={formData.bannerName}
                  onChange={(e) => setFormData({ ...formData, bannerName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Banner Size</label>
                <select
                  className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded text-text-primary focus:border-brand-purple outline-none"
                  value={formData.bannerSize}
                  onChange={(e) => setFormData({ ...formData, bannerSize: e.target.value })}
                >
                  {bannerSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4">
              Preview: {formData.bannerSize} - Upload your banner image after creating the campaign
            </p>
          </Card>

          {/* Conversion Type */}
          <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Conversion Type</h2>
            <select
              className="w-full px-3 py-2 bg-bg-dark border border-border-dark rounded text-text-primary focus:border-brand-purple outline-none"
              value={formData.conversionType}
              onChange={(e) => setFormData({ ...formData, conversionType: e.target.value })}
            >
              <option value="all">All</option>
              <option value="registration">Registration</option>
              <option value="purchase">Purchase</option>
              <option value="lead">Lead</option>
            </select>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-6">
            <Button variant="secondary" fullWidth>
              Save as Draft
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleCreateCampaign}
              isLoading={isSubmitting}
            >
              Start Campaign
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
