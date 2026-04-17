"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Download, Search, TrendingUp, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

interface CountryVolumeData {
  id: string;
  country: string;
  iso: string;
  flag: string;
  pricing: {
    push: { min: number; max: number };
    inpage: { min: number; max: number };
    pop: { min: number; max: number };
  };
  verticals: string[];
}

// All data comes from real Push House API - no mock data

export default function NetworkVolumePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiDetails, setApiDetails] = useState<any>(null);
  const [countryData, setCountryData] = useState<CountryVolumeData[]>([]);
  const [filteredData, setFilteredData] = useState<CountryVolumeData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [formatFilter, setFormatFilter] = useState("All");
  const [countryFilterValue, setCountryFilterValue] = useState("All countries");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Increased for better viewing

  // Convert ISO code to flag emoji
  const getCountryFlag = (iso: string): string => {
    if (!iso || iso.length !== 2) return "🌍";
    const codePoints = iso
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Load data from API
  useEffect(() => {
    const fetchNetworkVolume = async () => {
      try {
        setLoading(true);

        // Fetch real country data from backend proxy route
        const response = await fetch("/api/countries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // Transform real API data to match interface
          const transformedData = data.data
            .filter((item: any) => item.name && item.iso && item.pricing) // Validate data
            .map((item: any, idx: number) => {
              return {
                id: String(item.id || idx + 1),
                country: item.name || "Unknown",
                iso: item.iso || "XX",
                flag: getCountryFlag(item.iso),
                pricing: item.pricing || {
                  push: { min: 0, max: 0 },
                  inpage: { min: 0, max: 0 },
                  pop: { min: 0, max: 0 },
                },
                verticals: item.verticals || ["Push Ads", "Inpage Ads", "Pop Ads"],
              };
            });

          setCountryData(transformedData);
          setFilteredData(transformedData);
          toast.success(`Loaded ${transformedData.length} countries with real Push House pricing!`);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Failed to load network volume data:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Error details:", errorMsg);
        setError(errorMsg);
        
        // Try to get more details from the error response
        try {
          const response = await fetch("/api/countries");
          const errorData = await response.json();
          if (errorData.details) {
            setApiDetails(errorData);
          }
        } catch (detailError) {
          // Silently fail on detail fetch
        }
        
        toast.error(`Failed to fetch real data from Push House: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkVolume();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = countryData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.iso.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Format filter
    if (formatFilter !== "All") {
      filtered = filtered.filter((item) =>
        item.verticals.some((v) => v.includes(formatFilter))
      );
    }

    // Country filter
    if (countryFilterValue !== "All countries") {
      filtered = filtered.filter((item) => item.country === countryFilterValue);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    formatFilter,
    countryFilterValue,
    countryData,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExportData = () => {
    toast.loading("Exporting data...");

    setTimeout(() => {
      toast.dismiss();
      const headers = [
        "Country",
        "ISO",
        "Push Min",
        "Push Max",
        "Inpage Min",
        "Inpage Max",
        "Pop Min",
        "Pop Max",
        "Verticals",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredData.map((row) =>
          [
            row.country,
            row.iso || "N/A",
            (row.pricing.push.min || 0).toFixed(6),
            (row.pricing.push.max || 0).toFixed(4),
            (row.pricing.inpage.min || 0).toFixed(6),
            (row.pricing.inpage.max || 0).toFixed(4),
            (row.pricing.pop.min || 0).toFixed(6),
            (row.pricing.pop.max || 0).toFixed(4),
            (row.verticals || []).join("|"),
          ].join(",")
        ),
      ].join("\n");

      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
      );
      element.setAttribute(
        "download",
        `network-volume-${new Date().toISOString().split("T")[0]}.csv`
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success("Data exported successfully!");
    }, 1200);
  };

  // Safe number formatting helper
  const formatPrice = (value: any, decimals: number = 4): string => {
    if (typeof value !== "number" || isNaN(value)) return "$0.00";
    return `$${value.toFixed(decimals)}`;
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Network Volume & Trends
            </h1>
            <p className="text-text-secondary">
              Country-level traffic volume and performance metrics
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={handleExportData}
          >
            Export
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card variant="glass" className="mb-6 border border-red-500/20 bg-red-500/5">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-1">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-400 mb-1">API Connection Error</h3>
                  <p className="text-text-secondary text-sm mb-3">{error}</p>
                  
                  {apiDetails && (
                    <div className="bg-bg-dark/50 rounded p-3 text-xs font-mono text-text-muted space-y-2">
                      <p><span className="text-text-secondary">Status:</span> {apiDetails.message}</p>
                      <p><span className="text-text-secondary">Timestamp:</span> {apiDetails.debug?.timestamp}</p>
                      
                      {apiDetails.debug?.triedEndpoints && (
                        <div>
                          <p className="text-text-secondary font-semibold mb-1">Endpoints Tried:</p>
                          {apiDetails.debug.triedEndpoints.map((endpoint: string, idx: number) => (
                            <p key={idx} className="text-text-muted">
                              {idx + 1}. {endpoint}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-text-secondary">
                    <p className="mb-2"><strong>Troubleshooting:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-text-muted">
                      <li>Verify Push House API token is correct (currently: "123")</li>
                      <li>Check if Push House API server is accessible</li>
                      <li>Verify network connectivity</li>
                      <li>Check browser console for more details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Filters Section */}
        <Card variant="glass" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase">
                Search Countries
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Format Filter */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase">
                Format
              </label>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border-dark text-text-primary text-sm focus:outline-none focus:border-brand-purple transition-default"
              >
                <option>All</option>
                <option>Dating</option>
                <option>Sweepstakes</option>
                <option>Shopping</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase">
                Country
              </label>
              <select
                value={countryFilterValue}
                onChange={(e) => setCountryFilterValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border-dark text-text-primary text-sm focus:outline-none focus:border-brand-purple transition-default"
              >
                <option>All countries</option>
                {countryData.map((country) => (
                  <option key={country.id} value={country.country}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card variant="glass">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-16" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-dark">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-widest">
                        Country
                      </th>
                      <th colSpan={2} className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest border-l border-border-dark">
                        Push Ads
                      </th>
                      <th colSpan={2} className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest border-l border-border-dark">
                        Inpage Ads
                      </th>
                      <th colSpan={2} className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest border-l border-border-dark">
                        Pop Ads
                      </th>
                    </tr>
                    <tr className="border-b border-border-dark">
                      <th className="px-4 py-3"></th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest">Min</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest">Max</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest border-l border-border-dark">Min</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest">Max</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest border-l border-border-dark">Min</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-widest">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`border-b border-border-dark hover:bg-bg-dark/50 transition-default ${
                            idx % 2 === 0 ? "bg-bg-dark/20" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-sm text-text-primary font-medium">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{row.flag}</span>
                              <div>
                                <div>{row.country}</div>
                                <div className="text-xs text-text-muted">{row.iso}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium">
                            {formatPrice(row.pricing.push.min, 6)}
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium">
                            {formatPrice(row.pricing.push.max, 4)}
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium border-l border-border-dark">
                            {formatPrice(row.pricing.inpage.min, 6)}
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium">
                            {formatPrice(row.pricing.inpage.max, 4)}
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium border-l border-border-dark">
                            {formatPrice(row.pricing.pop.min, 6)}
                          </td>
                          <td className="px-4 py-4 text-sm text-text-primary text-center font-medium">
                            {formatPrice(row.pricing.pop.max, 4)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                          {loading ? "Loading real data from Push House..." : "No data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-dark">
                  <p className="text-sm text-text-muted">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                    {filteredData.length} results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                          className={`w-8 h-8 rounded text-sm font-medium transition-default ${
                            currentPage === idx + 1
                              ? "bg-brand-purple text-white"
                              : "bg-bg-dark text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-brand-purple/10 to-transparent border-brand-purple/30">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
              Total Volume
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {filteredData.reduce((sum, row) => sum + row.volume, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-cyan/10 to-transparent border-brand-cyan/30">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
              Avg CPM
            </p>
            <p className="text-2xl font-bold text-text-primary">
              ${(filteredData.reduce((sum, row) => sum + row.cpm, 0) / filteredData.length).toFixed(3)}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-green/10 to-transparent border-brand-green/30">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
              Avg CTR
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {(
                (filteredData.reduce((sum, row) => sum + row.ctr, 0) / filteredData.length) *
                100
              ).toFixed(2)}
              %
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-orange/10 to-transparent border-brand-orange/30">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
              Yesterday's Total
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {filteredData.reduce((sum, row) => sum + row.yesterdayClicks, 0).toLocaleString()}
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
