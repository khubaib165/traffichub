"use client";

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, TrendingUp, Users, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function PartnersPage() {
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Generate a referral link
  const referralLink = "https://trafficflow.io/ref/partner_" + Math.random().toString(36).substr(2, 9);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Partner Program
            </h1>
            <p className="text-text-secondary">Earn commissions by referring advertisers</p>
          </div>
          <Button 
            variant="primary"
            onClick={handleCopyReferralLink}
            icon={copiedLink ? <Check size={16} /> : <Copy size={16} />}
          >
            {copiedLink ? "Link Copied" : "Get Referral Link"}
          </Button>
        </div>

        {/* Referral Link Display */}
        <Card className="mb-8 border-l-4 border-brand-cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm mb-2">Your Referral Link</p>
              <code className="text-sm text-text-primary bg-bg-dark p-3 rounded block break-all">
                {referralLink}
              </code>
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyReferralLink}
              icon={copiedLink ? <Check size={16} /> : <Copy size={16} />}
            >
              {copiedLink ? "Copied" : "Copy"}
            </Button>
          </div>
        </Card>

        {/* Commission Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Your Commission Rate", value: "15%", icon: "📈" },
            { label: "Active Referrals", value: "8", icon: "👥" },
            { label: "Total Earned", value: "$1,240", icon: "💵" },
          ].map((item, idx) => (
            <Card key={idx} variant="glass">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-text-muted text-sm mb-1">{item.label}</p>
              <p className="text-3xl font-bold text-text-primary">{item.value}</p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Get Your Link</h4>
                <p className="text-sm text-text-muted">
                  Each referral has a unique tracking link. Share it with potential
                  advertisers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">They Sign Up</h4>
                <p className="text-sm text-text-muted">
                  When they click your link and create an account, they're linked to you.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">You Earn</h4>
                <p className="text-sm text-text-muted">
                  Earn 15% commission on their spending for 12 months.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Referrals */}
        <Card>
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Advertiser</th>
                  <th>Signup Date</th>
                  <th>Their Spend</th>
                  <th>Your Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Alex Johnson",
                    date: "Apr 10, 2026",
                    spend: "$450.50",
                    commission: "$67.58",
                    status: "active",
                  },
                  {
                    name: "Sarah Chen",
                    date: "Apr 8, 2026",
                    spend: "$1,250.00",
                    commission: "$187.50",
                    status: "active",
                  },
                  {
                    name: "Mike Rodriguez",
                    date: "Apr 5, 2026",
                    spend: "$320.75",
                    commission: "$48.11",
                    status: "active",
                  },
                ].map((referral, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{referral.name}</td>
                    <td className="text-sm text-text-muted">{referral.date}</td>
                    <td className="font-semibold">{referral.spend}</td>
                    <td className="text-brand-green font-semibold">
                      {referral.commission}
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-brand-green/10 text-brand-green text-xs rounded-full">
                        {referral.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
