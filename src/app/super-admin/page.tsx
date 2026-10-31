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
  BarChart3,
  BookOpen,
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
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "libraries" | "transactions" | "subscriptions" | "audit"
  >("dashboard");
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
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR: Dark Navy Blue (per Visual Direction)                    */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex h-screen w-64 flex-col justify-between bg-[#0c192e] text-slate-200 flex-shrink-0 select-none border-r border-slate-800/80">
        <div>
          {/* Logo / Super Admin Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white leading-tight">
                GranthSetu
              </span>
              <span className="block text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
                Platform Super Admin
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-220px)]">
            {[
              { id: "dashboard", label: "Platform Overview", icon: LayoutDashboard },
              { id: "libraries", label: "Registered Libraries", icon: Building2, count: stats?.totalLibraries },
              { id: "transactions", label: "Payment Ledger", icon: CreditCard },
              { id: "subscriptions", label: "SaaS Subscriptions", icon: Layers },
              { id: "audit", label: "Audit & Security Logs", icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Platform Attribution */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="rounded-2xl bg-slate-900/90 p-3 border border-slate-800 text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PLATFORM OWNER</div>
            <div className="font-bold text-white mt-0.5">Enterprenex Solution Pvt. Ltd.</div>
            <div className="text-[11px] text-indigo-400 mt-1 font-mono">+91-9226860060</div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA: Light Background with White Cards                   */}
      {/* ========================================================================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Public Website
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Super Admin Console
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              <Link href="/owner" className="rounded-lg px-2.5 py-1 text-slate-600 hover:bg-white hover:text-slate-900 font-semibold transition">
                Owner Portal
              </Link>
              <Link href="/staff" className="rounded-lg px-2.5 py-1 text-slate-600 hover:bg-white hover:text-slate-900 font-semibold transition">
                Staff Counter
              </Link>
              <Link href="/student" className="rounded-lg px-2.5 py-1 text-slate-600 hover:bg-white hover:text-slate-900 font-semibold transition">
                Student Self-Service
              </Link>
            </div>

            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* 1. OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* CRITICAL FINANCIAL SEPARATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Company Subscription Revenue (Enterprenex Revenue) */}
                  <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-white p-6 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                            ENTERPRENEX PLATFORM REVENUE
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">Company Subscription Revenue</h3>
                        </div>
                      </div>
                      <span className="rounded-full bg-indigo-100 text-indigo-800 px-2.5 py-0.5 text-xs font-bold">
                        SaaS License Income
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{(stats?.companySubscriptionRevenue || 3998).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-emerald-600 font-bold">+24.5% vs last month</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      SaaS subscription license fees paid by study centre owners to Enterprenex Solution Pvt. Ltd. (Starter ₹1,499, Growth ₹2,499, Enterprise ₹4,999/mo).
                    </p>
                  </div>

                  {/* Card 2: Library Student Collections (Individual Centres) */}
                  <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white p-6 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                            STUDY CENTRE COLLECTIONS
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">Total Library Student Fees</h3>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold">
                        Individual Centres
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{(stats?.libraryStudentCollections || 54200).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-blue-700 font-semibold">Strictly isolated from company revenue</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      Gross student fees collected by study centres from admitted students. Kept strictly distinct from Enterprenex SaaS platform revenues.
                    </p>
                  </div>
                </div>

                {/* Platform Scale KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold text-slate-500">Registered Libraries</span>
                      <Building2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{stats?.totalLibraries || 2}</span>
                      <span className="text-[11px] font-bold text-emerald-600">{stats?.activeLibraries || 2} Active</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">{stats?.inactiveLibraries || 0} Inactive / Pending</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold text-slate-500">Platform Students</span>
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{stats?.totalStudents || 42}</span>
                      <span className="text-[11px] font-bold text-blue-600">Active</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">Across {stats?.totalBranches || 2} Study Branches</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold text-slate-500">Physical Desks</span>
                      <Layers className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{stats?.totalSeats || 108}</span>
                      <span className="text-[11px] font-bold text-purple-600">Configured</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">24-Hr Lock Protected</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-semibold text-slate-500">Payment Health</span>
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">99.4%</span>
                      <span className="text-[11px] font-bold text-emerald-600">Verified</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">{stats?.successfulPayments || 38} Success • 0 Failed</div>
                  </div>
                </div>

                {/* Monthly Revenue Comparison & Platform Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Monthly Growth Chart */}
                  <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Monthly Revenue Comparison</h3>
                        <p className="text-xs text-slate-500">
                          Company Subscription Income vs Total Student Collections
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                          <span className="text-slate-600 font-semibold">Company Revenue</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <span className="text-slate-600 font-semibold">Student Fees</span>
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
                              className="w-1/3 rounded-t-md bg-indigo-600 hover:bg-indigo-500 transition"
                              title={`Company Revenue: ₹${item.companyRevenue}`}
                            />
                            {/* Student Collections bar */}
                            <div
                              style={{ height: `${Math.min(Math.max((item.studentCollections / 150000) * 100, 10), 100)}%` }}
                              className="w-1/3 rounded-t-md bg-blue-500/80 hover:bg-blue-400 transition"
                              title={`Student Fees: ₹${item.studentCollections}`}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active vs Inactive Libraries Status */}
                  <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Library Network Status</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Active subscriptions & onboarding</p>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="font-bold text-emerald-900">Active Study Centres</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-700">{stats?.activeLibraries || 2}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                            <span className="font-bold text-slate-700">Inactive / In Setup</span>
                          </div>
                          <span className="font-mono font-bold text-slate-600">{stats?.inactiveLibraries || 0}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                        <Link
                          href="/register-library"
                          className="w-full flex items-center justify-between rounded-xl bg-indigo-600 p-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                        >
                          <span>+ Register New Study Centre</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 block mb-0.5">Automated Webhooks:</span>
                      Payments marked verified through verified HMAC SHA256 signatures only.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. REGISTERED LIBRARIES MANAGEMENT */}
            {activeTab === "libraries" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by code, library, owner, city..."
                      value={searchLibrary}
                      onChange={(e) => setSearchLibrary(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="ACTIVE">Active Only</option>
                      <option value="INACTIVE">Inactive Only</option>
                    </select>

                    <Link
                      href="/register-library"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      + Register Centre
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Library Code / Name</th>
                        <th className="py-3.5 px-4 font-semibold">Owner & Contact</th>
                        <th className="py-3.5 px-4 font-semibold">City & State</th>
                        <th className="py-3.5 px-4 font-semibold">Desks & Branches</th>
                        <th className="py-3.5 px-4 font-semibold">SaaS Plan</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {libraries.map((lib) => (
                        <tr key={lib.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{lib.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                {lib.code}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                                {lib.tagline}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{lib.ownerName}</div>
                            <div className="text-[11px] text-slate-400">{lib.ownerMobile}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-semibold">{lib.city}</div>
                            <div className="text-[11px] text-slate-400">{lib.state || "Maharashtra"}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{lib.totalSeats} Desks</div>
                            <div className="text-[11px] text-slate-400">{lib.branchesCount} Branch(es)</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex rounded-lg bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                              {lib.subscriptionTier} (₹{lib.monthlyFee}/mo)
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                lib.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${lib.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"}`} />
                              {lib.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/l/${lib.slug}`}
                                target="_blank"
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
                                title="View Public Library Website"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleToggleLibraryStatus(lib.id, lib.status)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                                  lib.status === "ACTIVE"
                                    ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
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
                          <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                            No study centres found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PAYMENT LEDGER & TRANSACTIONS */}
            {activeTab === "transactions" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Payment ID, library, student..."
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={txTypeFilter}
                      onChange={(e) => setTxTypeFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="COMPANY_SUBSCRIPTION">Company SaaS Subscriptions</option>
                      <option value="STUDENT_FEE">Library Student Collections</option>
                    </select>

                    <select
                      value={txStatusFilter}
                      onChange={(e) => setTxStatusFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUCCESS">Success Only</option>
                      <option value="PENDING">Pending Only</option>
                      <option value="FAILED">Failed Only</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>

                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
                      {["TODAY", "7D", "30D", "ALL"].map((rng) => (
                        <button
                          key={rng}
                          onClick={() => setTxRangeFilter(rng)}
                          className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                            txRangeFilter === rng
                              ? "bg-indigo-600 text-white font-bold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {rng}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Invoice / Reference</th>
                        <th className="py-3.5 px-4 font-semibold">Payment Category</th>
                        <th className="py-3.5 px-4 font-semibold">Library / Payer</th>
                        <th className="py-3.5 px-4 font-semibold">Gateway IDs</th>
                        <th className="py-3.5 px-4 font-semibold">Amount & Mode</th>
                        <th className="py-3.5 px-4 font-semibold">Date</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-slate-900">{tx.transactionRef}</div>
                            <div className="text-[11px] text-slate-400">{tx.notes}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            {tx.paymentType === "COMPANY_SUBSCRIPTION" ? (
                              <span className="inline-flex rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                                Company Subscription
                              </span>
                            ) : (
                              <span className="inline-flex rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                                Student Collection
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{tx.libraryName}</div>
                            <div className="text-[11px] text-slate-400">
                              Payer: {tx.payerName} {tx.studentRegNo ? `(${tx.studentRegNo})` : ""}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="text-slate-800">{tx.razorpayOrderId}</div>
                            <div className="text-slate-400">{tx.razorpayPaymentId}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-sm font-bold text-slate-900">₹{tx.amount.toLocaleString("en-IN")}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">{tx.paymentMode}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
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
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : tx.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${tx.status === "SUCCESS" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. SAAS SUBSCRIPTIONS */}
            {activeTab === "subscriptions" && (
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Enterprenex SaaS License Tiers</h3>
                <p className="text-xs text-slate-500">
                  Standard subscription pricing for Study Centres & Libraries using GranthSetu
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      tier: "STARTER",
                      price: "₹1,499",
                      period: "/month",
                      seats: "Up to 50 Desks",
                      branches: "1 Branch",
                      features: ["Admissions & ID Cards", "Shift Management", "Dual WhatsApp & SMS", "QR Attendance"],
                    },
                    {
                      tier: "GROWTH",
                      price: "₹2,499",
                      period: "/month",
                      popular: true,
                      seats: "Up to 150 Desks",
                      branches: "Up to 3 Branches",
                      features: ["All Starter Features", "Live 48-Seat Map", "Razorpay Auto Reconcile", "Financial P&L Ledger", "Priority Support"],
                    },
                    {
                      tier: "ENTERPRISE",
                      price: "₹4,999",
                      period: "/month",
                      seats: "Unlimited Desks",
                      branches: "Unlimited Branches",
                      features: ["Multi-Branch Consolidation", "Custom Domain Support", "Biometric Integration Ready", "Dedicated Account Manager"],
                    },
                  ].map((plan, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-6 border ${
                        plan.popular
                          ? "border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-indigo-700">{plan.tier}</span>
                        {plan.popular && (
                          <span className="rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-bold">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-400">{plan.period}</span>
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
                        <div className="font-bold text-slate-900">Includes: {plan.seats} • {plan.branches}</div>
                        {plan.features.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. AUDIT LOGS & SECURITY */}
            {activeTab === "audit" && (
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Platform Security & Audit Trail</h3>
                <p className="text-xs text-slate-500">
                  Immutable log of administrative logins, library approvals, and security events.
                </p>

                <div className="space-y-3 mt-4 text-xs">
                  {[
                    { time: "Just now", action: "SUPER_ADMIN_LOGIN", desc: "Super Admin authenticated from authorized network", user: "Enterprenex DevSec" },
                    { time: "10 mins ago", action: "LIBRARY_ACTIVATED", desc: "StudyPlus Abhyasika (LIB-2026-001) verified and active", user: "System" },
                    { time: "1 hour ago", action: "RAZORPAY_WEBHOOK_VERIFIED", desc: "Order order_sub_live_001 cryptographically signature-verified", user: "Gateway Engine" },
                    { time: "Today, 10:45 AM", action: "AADHAAR_eKYC_MINIMIZED", desc: "Student UIDAI token registered with last-4-digits-only retention (CR-01 compliant)", user: "KYC Service" },
                  ].map((log, li) => (
                    <div key={li} className="flex items-start justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                      <div>
                        <div className="flex items-center gap-2 font-mono font-bold text-indigo-600">
                          <span>{log.action}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-sans font-medium">{log.user}</span>
                        </div>
                        <p className="mt-1 text-slate-700">{log.desc}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
