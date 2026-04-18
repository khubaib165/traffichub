"use client";

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const mockTransactions = [
  {
    id: "1",
    type: "deposit",
    description: "Deposit via Credit Card",
    amount: "+$100.00",
    amountNum: 100,
    date: "Apr 14, 2026",
    status: "completed",
  },
  {
    id: "2",
    type: "spend",
    description: "Campaign spend",
    amount: "-$34.20",
    amountNum: 34.2,
    date: "Apr 14, 2026",
    status: "completed",
  },
  {
    id: "3",
    type: "deposit",
    description: "Deposit via Crypto",
    amount: "+$250.00",
    amountNum: 250,
    date: "Apr 12, 2026",
    status: "completed",
  },
];

const cryptoAddresses = {
  bitcoin: "1A1z7agoat2TYJZLt73zL5T73GHzKjzCdm",
  ethereum: "0x742d35Cc6634C0532925a3b844Bc9e7595f82bCE",
  usdt: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
};

export default function WalletPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [cardData, setCardData] = useState({ number: "", exp: "", cvc: "" });
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleDeposit = async (amount: string) => {
    const numAmount = parseFloat(amount || depositAmount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    toast.loading("Processing deposit...");
    // Simulate API call
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Deposit of $${numAmount.toFixed(2)} initiated!`);
      setShowDepositModal(false);
      setDepositAmount("");
    }, 1500);
  };

  const handleAddCard = async () => {
    if (!cardData.number || !cardData.exp || !cardData.cvc) {
      toast.error("Please fill in all card details");
      return;
    }
    
    toast.loading("Adding card...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Card added successfully!");
      setShowCardModal(false);
      setCardData({ number: "", exp: "", cvc: "" });
    }, 1200);
  };

  const handleCopyAddress = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(name);
    toast.success(`${name} address copied!`);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Wallet</h1>
            <p className="text-text-secondary">Manage your funds and transactions</p>
          </div>
        </div>

        {/* Balance Display */}
        <Card
          variant="gradient"
          className="mb-8 border-l-4 border-brand-cyan relative overflow-hidden"
        >
          <div className="absolute -right-32 -top-32 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-text-muted text-sm mb-2">Total Balance</p>
            <h2 className="text-5xl font-bold text-text-primary mb-1">$384.30</h2>
            <div className="flex gap-6 text-sm mt-4">
              <div>
                <p className="text-text-muted">Total Deposited</p>
                <p className="font-semibold text-text-primary">$1,234.50</p>
              </div>
              <div>
                <p className="text-text-muted">Total Spent</p>
                <p className="font-semibold text-text-primary">$850.20</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Deposit Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {["$25", "$50", "$100", "$250", "Custom"].map((amount) => (
            <Button
              key={amount}
              variant={amount === "$100" ? "primary" : "secondary"}
              fullWidth
              size="md"
              onClick={() => setShowDepositModal(true)}
            >
              {amount}
            </Button>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card Payment */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Card Payments
                </h3>
                <p className="text-sm text-text-muted">Visa, Mastercard, Amex</p>
              </div>
              <div className="text-3xl">💳</div>
            </div>
            <Button 
              variant="primary" 
              fullWidth 
              size="md"
              onClick={() => setShowCardModal(true)}
            >
              Add Card
            </Button>
          </Card>

          {/* Crypto Payment */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Cryptocurrency
                </h3>
                <p className="text-sm text-text-muted">Bitcoin, Ethereum, USDT</p>
              </div>
              <div className="text-3xl">₿</div>
            </div>
            <Button 
              variant="secondary" 
              fullWidth 
              size="md"
              onClick={() => setShowCryptoModal(true)}
            >
              View Addresses
            </Button>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Transaction History
          </h2>
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border-l-4 border-brand-cyan rounded-lg bg-bg-dark hover:bg-bg-card transition-default"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      tx.type === "deposit"
                        ? "bg-brand-green/20"
                        : "bg-brand-red/20"
                    }`}
                  >
                    {tx.type === "deposit" ? "📥" : "📤"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{tx.description}</p>
                    <p className="text-xs text-text-muted">{tx.date}</p>
                  </div>
                </div>
                <p
                  className={`font-bold text-lg ${
                    tx.type === "deposit" ? "text-brand-green" : "text-brand-red"
                  }`}
                >
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Deposit Funds</h2>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="p-1.5 hover:bg-bg-card rounded"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Deposit Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["25", "50", "100", "250"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepositAmount(amt)}
                      className="p-2 bg-bg-card hover:bg-brand-purple/20 border border-border-dark hover:border-brand-purple rounded transition-default text-sm"
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowDepositModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleDeposit(depositAmount)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add Card Modal */}
        {showCardModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Add payment Card</h2>
                <button
                  onClick={() => setShowCardModal(false)}
                  className="p-1.5 hover:bg-bg-card rounded"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.exp}
                      onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      CVC
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowCardModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAddCard}
                  >
                    Add Card
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Crypto Addresses Modal */}
        {showCryptoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Send Cryptocurrency</h2>
                <button
                  onClick={() => setShowCryptoModal(false)}
                  className="p-1.5 hover:bg-bg-card rounded"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(cryptoAddresses).map(([crypto, address]) => (
                  <div
                    key={crypto}
                    className="p-3 bg-bg-card border border-border-dark rounded-lg"
                  >
                    <p className="text-sm font-semibold text-text-primary capitalize mb-2">
                      {crypto}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-text-muted flex-1 truncate bg-bg-dark p-2 rounded">
                        {address}
                      </code>
                      <button
                        onClick={() => handleCopyAddress(address, crypto)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-default ${
                          copiedAddress === crypto
                            ? "bg-brand-green text-white"
                            : "bg-brand-purple hover:bg-brand-purple/80 text-white"
                        }`}
                      >
                        {copiedAddress === crypto ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                fullWidth
                className="mt-4"
                onClick={() => setShowCryptoModal(false)}
              >
                Close
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
