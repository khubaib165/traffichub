"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Globe, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function NetworksPage() {
  const pathname = usePathname();
  const [connectedNetworks, setConnectedNetworks] = useState<string[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isVolumePage = pathname === "/networks/volume";

  // Fetch networks from API
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/networks");
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setNetworks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch networks:", error);
        toast.error("Failed to load networks");
        setNetworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworks();
  }, []);

  const handleConnectNetwork = async (networkId: string, networkName: string) => {
    if (connectedNetworks.includes(networkId)) {
      toast("Already connected to " + networkName);
      return;
    }

    toast.loading("Connecting to " + networkName + "...");
    
    // Simulate API call
    setTimeout(() => {
      toast.dismiss();
      setConnectedNetworks((prev) => [...prev, networkId]);
      toast.success("Successfully connected to " + networkName);
    }, 1500);
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Available Networks
            </h1>
            <p className="text-text-secondary">Browse and connect to quality ad networks</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border-dark">
          <Link
            href="/networks"
            className={`px-4 py-3 text-sm font-medium transition-default border-b-2 whitespace-nowrap ${
              !isVolumePage
                ? "text-text-primary border-brand-purple"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe size={16} />
              Available Networks
            </div>
          </Link>
          <Link
            href="/networks/volume"
            className={`px-4 py-3 text-sm font-medium transition-default border-b-2 whitespace-nowrap ${
              isVolumePage
                ? "text-text-primary border-brand-purple"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              Network Volume & Trends
            </div>
          </Link>
        </div>

        {/* Network Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-12">
              <p className="text-text-muted">Loading networks...</p>
            </div>
          )}
          {networks.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <p className="text-text-muted">No networks available</p>
            </div>
          )}
          {networks.map((network) => {
            const isConnected = connectedNetworks.includes(network.id);
            return (
              <Card key={network.id} variant="glass" className={isConnected ? "border-brand-green/50 border-l-4 border-l-brand-green" : ""}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {network.name || "Network"}
                      </h3>
                      {isConnected && (
                        <CheckCircle size={20} className="text-brand-green" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      <Globe size={12} className="inline mr-1" />
                      {network.countries || network.volume || "N/A"} volume
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-brand-purple/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-brand-purple" size={20} />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <p className="text-text-muted mb-1">Formats</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(network.formats) ? (
                        network.formats.map((fmt: any) => (
                          <span
                            key={fmt}
                            className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-xs rounded"
                          >
                            {fmt}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-xs rounded">
                          Push Ads
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-bg-dark rounded">
                      <p className="text-xs text-text-muted mb-1">Daily Volume</p>
                      <p className="font-bold text-text-primary text-sm">
                        {network.dailyVolume || (network.volume ? `${(network.volume / 1000000).toFixed(1)}M` : "N/A")}
                      </p>
                    </div>
                    <div className="p-2 bg-bg-dark rounded">
                      <p className="text-xs text-text-muted mb-1">Avg Bid</p>
                      <p className="font-bold text-text-primary text-sm">
                        {network.avgBid || "$0.02"}
                      </p>
                    </div>
                    <div className="p-2 bg-bg-dark rounded">
                      <p className="text-xs text-text-muted mb-1">Status</p>
                      <p className="font-bold text-brand-green text-sm capitalize">
                        {network.status || "active"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant={isConnected ? "secondary" : "primary"}
                  fullWidth 
                  size="md"
                  onClick={() => handleConnectNetwork(network.id, network.name)}
                  disabled={isConnected}
                >
                  {isConnected ? "✓ Connected" : "Connect Network"}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Network Stats Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Network Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Networks", value: "3", icon: "🌐" },
              { label: "Total Countries", value: "417", icon: "🗺️" },
              { label: "Daily Volume", value: "9.4M", icon: "📊" },
              { label: "Avg Network Bid", value: "$0.02", icon: "💰" },
            ].map((stat, idx) => (
              <Card key={idx} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-text-muted text-xs mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

