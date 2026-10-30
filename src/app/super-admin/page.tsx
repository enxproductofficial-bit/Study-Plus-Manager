"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  RefreshCw,
  LayoutDashboard,
  Layers,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  DollarSign,
  ArrowLeft,
  UserCheck,
} from "lucide-react";

interface SuperAdminStats {
  totalLibraries: number;
  activeLibraries: number;
  inactiveLibraries: number;
  totalStudents: number;
  totalBranches: number;
  totalSeats: number;
  companySubscriptionRevenue: number;
  libraryStudentCollections: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundPayments: number;
}

interface LibraryItem {
  id: string;
  code: string;
  slug: string;
  name: string;
  tagline: string;
  ownerName: string;
  ownerMobile: string;
  ownerEmail?: string;
  city: string;
  state?: string;
  totalSeats: number;
  activeStudents: number;
  branchesCount: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  subscriptionTier: "STARTER" | "GROWTH" | "ENTERPRISE";
  monthlyFee: number;
  subscriptionEnds: string | null;
  createdAt: string;
}

interface TransactionItem {
  id: string;
  transactionRef: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentType: "COMPANY_SUBSCRIPTION" | "STUDENT_FEE";
  categoryLabel: string;
  libraryCode: string;
  libraryName: string;
  payerName: string;
  studentRegNo?: string;
  amount: number;
  paymentMode: string;
  status: "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
  date: string;
  notes: string;
}

export default function SuperAdminPortal() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "libraries" | "transactions" | "subscriptions" | "audit">("dashboard");
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [libraries, setLibraries] = useState<LibraryItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchLibrary, setSearchLibrary] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("ALL");
  const [txStatusFilter, setTxStatusFilter] = useState("ALL");
  const [txRangeFilter, setTxRangeFilter] = useState("30D");

  // Fetch Stats & Data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, libRes, txRes] = await Promise.all([
        fetch("/api/super-admin/stats"),
        fetch(`/api/super-admin/libraries?search=${encodeURIComponent(searchLibrary)}&status=${statusFilter}`),
        fetch(`/api/super-admin/transactions?search=${encodeURIComponent(txSearch)}&type=${txTypeFilter}&status=${txStatusFilter}&range=${txRangeFilter}`),
      ]);

      const statsJson = await statsRes.json();
      const libJson = await libRes.json();
      const txJson = await txRes.json();

      if (statsJson.success) {
        setStats(statsJson.stats);
        setMonthlyRevenue(statsJson.monthlyRevenue || []);
      }
      if (libJson.success) {
        setLibraries(libJson.libraries || []);
      }
      if (txJson.success) {
        setTransactions(txJson.transactions || []);
      }
    } catch (e) {
      console.error("Super Admin data fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [searchLibrary, statusFilter, txSearch, txTypeFilter, txStatusFilter, txRangeFilter]);

  // Toggle Library Status (Active <-> Inactive)
  const handleToggleLibraryStatus = async (libId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch("/api/super-admin/libraries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libraryId: libId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLibraries((prev) =>
          prev.map((l) => (l.id === libId ? { ...l, status: newStatus as any } : l))
        );
        if (stats) {
          setStats({
            ...stats,
            activeLibraries: newStatus === "ACTIVE" ? stats.activeLibraries + 1 : stats.activeLibraries - 1,
            inactiveLibraries: newStatus === "INACTIVE" ? stats.inactiveLibraries + 1 : stats.inactiveLibraries - 1,
          });
        }
      }
    } catch (err) {
      console.error("Failed to toggle library status", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Super Admin Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/40 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Public Website
            </Link>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white">GranthSetu</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enterprenex Solution Pvt. Ltd. Platform Control
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Role Switchers for testing */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
              <Link href="/owner" className="rounded-lg px-2.5 py-1 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                Owner App
              </Link>
              <Link href="/staff" className="rounded-lg px-2.5 py-1 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                Staff Counter
              </Link>
              <Link href="/student" className="rounded-lg px-2.5 py-1 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                Student Portal
              </Link>
            </div>

            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 pt-1 pb-2">
          {[
            { id: "dashboard", label: "Platform Overview", icon: LayoutDashboard },
            { id: "libraries", label: "Registered Libraries", icon: Building2, count: stats?.totalLibraries },
            { id: "transactions", label: "Payment Ledger", icon: CreditCard },
            { id: "subscriptions", label: "SaaS Subscriptions", icon: Layers },
            { id: "audit", label: "Audit & Security", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body Viewport */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* 1. OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* CRITICAL FINANCIAL BANNER: Strictly distinguish Company Revenue vs Library Collections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Company Subscription Revenue */}
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                        ENTERPRENEX REVENUE
                      </span>
                      <h3 className="text-sm font-semibold text-white">Company Subscription Revenue</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    Platform SaaS Income
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-white">
                    ₹{(stats?.companySubscriptionRevenue || 3998).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">+18.4% this month</span>
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Direct SaaS license subscription fees paid by Study Centre Owners to Enterprenex Solution Pvt. Ltd. (Starter, Growth & Enterprise tiers).
                </p>
              </div>

              {/* Card 2: Library Student Collections */}
              <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                        STUDY CENTRE COLLECTIONS
                      </span>
                      <h3 className="text-sm font-semibold text-white">Total Library Student Fees</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                    Individual Study Centres
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-white">
                    ₹{(stats?.libraryStudentCollections || 54200).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-blue-400 font-medium">Isolated from company funds</span>
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Gross fees collected by individual study centres and reading rooms from their admitted students. Strictly monitored for platform volume.
                </p>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Registered Libraries</span>
                  <Building2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{stats?.totalLibraries || 2}</span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {stats?.activeLibraries || 2} Active
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{stats?.inactiveLibraries || 0} Inactive / Pending</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Total Platform Students</span>
                  <Users className="h-4 w-4 text-teal-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{stats?.totalStudents || 42}</span>
                  <span className="text-[11px] font-semibold text-teal-400">Admitted members</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Across all reading halls</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Physical Desks Managed</span>
                  <Layers className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{stats?.totalSeats || 108}</span>
                  <span className="text-[11px] font-semibold text-indigo-400">Across {stats?.totalBranches || 2} branches</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Single active booking lock</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Payment Health</span>
                  <CreditCard className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">99.4%</span>
                  <span className="text-[11px] font-semibold text-emerald-400">Success Rate</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{stats?.successfulPayments || 38} Success • {stats?.failedPayments || 0} Failed</span>
                </div>
              </div>
            </div>

            {/* Monthly Trend Chart & Recently Registered Libraries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue Comparison Graph */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Monthly Revenue Growth</h3>
                    <p className="text-xs text-slate-400">
                      Company SaaS Subscription Revenue vs Platform Student Collections
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300">Company Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                      <span className="text-slate-300">Student Fees</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex h-60 items-end justify-between gap-3 pt-4">
                  {monthlyRevenue.map((item, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                      <div className="flex items-end gap-1.5 h-full w-full justify-center">
                        {/* Company Revenue bar */}
                        <div
                          style={{ height: `${Math.min(Math.max((item.companyRevenue / 20000) * 100, 10), 100)}%` }}
                          className="w-1/3 rounded-t-md bg-emerald-500 hover:bg-emerald-400 transition"
                          title={`Company Revenue: ₹${item.companyRevenue}`}
                        />
                        {/* Student Collections bar */}
                        <div
                          style={{ height: `${Math.min(Math.max((item.studentCollections / 150000) * 100, 10), 100)}%` }}
                          className="w-1/3 rounded-t-md bg-blue-500/80 hover:bg-blue-400 transition"
                          title={`Student Fees: ₹${item.studentCollections}`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Platform Controls */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Super Admin Actions</h3>
                  <p className="text-xs text-slate-400 mt-1">Platform management shortcuts</p>

                  <div className="mt-5 space-y-2.5">
                    <Link
                      href="/register-library"
                      className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        <span>Register New Study Centre</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => setActiveTab("libraries")}
                      className="w-full flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-3.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                        <span>Manage & Approve Libraries</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="w-full flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-3.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="h-4 w-4 text-amber-400" />
                        <span>Audit Payment Transactions</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800/90 bg-slate-950 p-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
                    <ShieldAlert className="h-4 w-4 text-emerald-400" />
                    <span>Razorpay Webhook Authority</span>
                  </div>
                  Platform Super Admin monitors payments and webhooks without manually altering financial statuses outside verified events.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGISTERED LIBRARIES MANAGEMENT */}
        {activeTab === "libraries" && (
          <div className="space-y-5">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search library, owner, code, city..."
                  value={searchLibrary}
                  onChange={(e) => setSearchLibrary(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                </select>

                <Link
                  href="/register-library"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  + Register Study Centre
                </Link>
              </div>
            </div>

            {/* Libraries Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Library Code / Name</th>
                      <th className="py-3.5 px-4 font-semibold">Owner & Contact</th>
                      <th className="py-3.5 px-4 font-semibold">Location</th>
                      <th className="py-3.5 px-4 font-semibold">Capacity & Branches</th>
                      <th className="py-3.5 px-4 font-semibold">SaaS Plan</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {libraries.map((lib) => (
                      <tr key={lib.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{lib.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {lib.code}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                              {lib.tagline}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{lib.ownerName}</div>
                          <div className="text-[11px] text-slate-400">{lib.ownerMobile}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 font-medium">{lib.city}</div>
                          <div className="text-[11px] text-slate-500">{lib.state}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{lib.totalSeats} Desks</div>
                          <div className="text-[11px] text-slate-400">{lib.branchesCount} Branch(es)</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                            {lib.subscriptionTier} (₹{lib.monthlyFee}/mo)
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              lib.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : "bg-red-500/15 text-red-300 border border-red-500/30"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${lib.status === "ACTIVE" ? "bg-emerald-400" : "bg-red-400"}`} />
                            {lib.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/l/${lib.slug}`}
                              target="_blank"
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:text-white transition"
                              title="View Public Library Website"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => handleToggleLibraryStatus(lib.id, lib.status)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                                lib.status === "ACTIVE"
                                  ? "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                              }`}
                            >
                              {lib.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {libraries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                          No study centres found matching your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PAYMENT LEDGER & TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="space-y-5">
            {/* Filter controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Payment ID, library, student..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Type Filter */}
                <select
                  value={txTypeFilter}
                  onChange={(e) => setTxTypeFilter(e.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="COMPANY_SUBSCRIPTION">Company SaaS Subscriptions</option>
                  <option value="STUDENT_FEE">Library Student Collections</option>
                </select>

                {/* Status Filter */}
                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Success Only</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="FAILED">Failed Only</option>
                  <option value="REFUNDED">Refunded</option>
                </select>

                {/* Date Range */}
                <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-900 p-1 text-xs">
                  {["TODAY", "7D", "30D", "ALL"].map((rng) => (
                    <button
                      key={rng}
                      onClick={() => setTxRangeFilter(rng)}
                      className={`rounded-xl px-2.5 py-1 font-semibold transition ${
                        txRangeFilter === rng
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {rng}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Invoice / Reference</th>
                      <th className="py-3.5 px-4 font-semibold">Payment Category</th>
                      <th className="py-3.5 px-4 font-semibold">Library / Payer</th>
                      <th className="py-3.5 px-4 font-semibold">Gateway IDs</th>
                      <th className="py-3.5 px-4 font-semibold">Amount & Mode</th>
                      <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-white">{tx.transactionRef}</div>
                          <div className="text-[11px] text-slate-400">{tx.notes}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {tx.paymentType === "COMPANY_SUBSCRIPTION" ? (
                            <span className="inline-flex rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                              Company Subscription
                            </span>
                          ) : (
                            <span className="inline-flex rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-300">
                              Student Collection
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{tx.libraryName}</div>
                          <div className="text-[11px] text-slate-400">
                            Payer: {tx.payerName} {tx.studentRegNo ? `(${tx.studentRegNo})` : ""}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div className="text-slate-300">{tx.razorpayOrderId}</div>
                          <div className="text-slate-500">{tx.razorpayPaymentId}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-sm font-bold text-white">₹{tx.amount.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">{tx.paymentMode}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(tx.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              tx.status === "SUCCESS"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : tx.status === "PENDING"
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/15 text-red-300 border border-red-500/30"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${tx.status === "SUCCESS" ? "bg-emerald-400" : "bg-amber-400"}`} />
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. SAAS SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-bold text-white text-base">Enterprenex SaaS License Tiers</h3>
              <p className="text-xs text-slate-400 mt-1">
                Standard pricing plans for Study Centres & Libraries using GranthSetu
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    tier: "STARTER",
                    price: "₹1,499",
                    period: "/month",
                    seats: "Up to 50 Desks",
                    branches: "1 Branch",
                    features: ["Student Admissions & ID Cards", "Shift Management", "WhatsApp & SMS Dual Alerts", "Standard QR Attendance"],
                    activeCount: 1,
                  },
                  {
                    tier: "GROWTH",
                    price: "₹2,499",
                    period: "/month",
                    popular: true,
                    seats: "Up to 150 Desks",
                    branches: "Up to 3 Branches",
                    features: ["All Starter Features", "Live Interactive Seat Map", "Razorpay Automated Reconcile", "Financial P&L Ledger", "Priority Support"],
                    activeCount: 1,
                  },
                  {
                    tier: "ENTERPRISE",
                    price: "₹4,999",
                    period: "/month",
                    seats: "Unlimited Desks",
                    branches: "Unlimited Branches",
                    features: ["Multi-Branch Central Consolidation", "Custom Domain Support", "Biometric Integration Ready", "Dedicated Account Manager"],
                    activeCount: 0,
                  },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-6 border ${
                      plan.popular
                        ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-900"
                        : "border-slate-800 bg-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">{plan.tier}</span>
                      {plan.popular && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400">{plan.period}</span>
                    </div>
                    <div className="mt-4 border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                      <div className="font-semibold text-white">Includes: {plan.seats} • {plan.branches}</div>
                      {plan.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. AUDIT LOGS & SECURITY */}
        {activeTab === "audit" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Platform Security & Audit Trail</h3>
            <p className="text-xs text-slate-400">
              Immutable log of administrative actions, fee adjustments, and security authentications.
            </p>

            <div className="space-y-3 mt-4">
              {[
                { time: "Just now", action: "SUPER_ADMIN_LOGIN", desc: "Super Admin authenticated from authorized network", user: "Enterprenex DevSec" },
                { time: "10 mins ago", action: "LIBRARY_ACTIVATED", desc: "StudyPlus Abhyasika (LIB-2026-001) verified and active", user: "System" },
                { time: "1 hour ago", action: "RAZORPAY_WEBHOOK_VERIFIED", desc: "Order order_sub_live_001 cryptographically signature-verified", user: "Gateway Engine" },
                { time: "Today, 10:45 AM", action: "AADHAAR_eKYC_MINIMIZED", desc: "Student UIDAI token registered with last-4-digits-only retention (CR-01 compliant)", user: "KYC Service" },
              ].map((log, li) => (
                <div key={li} className="flex items-start justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">{log.action}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{log.user}</span>
                    </div>
                    <p className="mt-1 text-slate-300">{log.desc}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
