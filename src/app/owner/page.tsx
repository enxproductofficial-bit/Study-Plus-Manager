"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { SeatMap } from "@/components/seats/SeatMap";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { FeeManager } from "@/components/fees/FeeManager";
import { AttendanceScanner } from "@/components/attendance/AttendanceScanner";
import { DualMessageHub } from "@/components/messaging/DualMessageHub";
import { LedgerView } from "@/components/ledger/LedgerView";
import { ArrowLeft, Sparkles, Building2, ExternalLink } from "lucide-react";

export default function OwnerPortalPage() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7fb] dark:bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole="OWNER"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentBranch={currentBranch}
          onBranchChange={setCurrentBranch}
          userRole="OWNER"
          userName="Adhyaksha (Owner)"
          onLogout={() => {
            window.location.href = "/";
          }}
          onSwitchToLanding={() => {
            window.location.href = "/";
          }}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-7xl">
            {/* Owner Top Banner with Public Page Link */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">OWNER ACCESS</span>
                <span>You have full administrative and financial P&L visibility for <strong>{currentBranch}</strong>.</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/l/studyplus-shivajinagar"
                  target="_blank"
                  className="inline-flex items-center gap-1 font-bold underline hover:text-emerald-200"
                >
                  View Public Library Website <ExternalLink className="h-3 w-3" />
                </Link>
                <span className="text-emerald-500/40">|</span>
                <Link
                  href="/super-admin"
                  className="font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Super Admin
                </Link>
              </div>
            </div>

            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole="OWNER" />
            )}
            {(currentTab === "seats" || currentTab === "students") && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {(currentTab === "expenses" || currentTab === "reports") && <LedgerView />}
            {currentTab === "enquiries" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Sales & Enquiries Pipeline (Module 01)
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Track student enquiries, shift preferences, follow-up callbacks, and conversion rates.
                </p>
                <div className="mt-6 inline-flex rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Connected with Branch: {currentBranch}
                </div>
              </div>
            )}
            {currentTab === "settings" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Library Settings & Configurations
                </h3>
                <p className="text-xs text-slate-400">
                  Configure study centre branding, shifts, Razorpay webhook settings, and WhatsApp templates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Shifts Configured</span>
                    <p className="text-xs text-slate-500 mt-1">Morning, Afternoon, Evening, 24-Hour Full Access</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Gateway</span>
                    <p className="text-xs text-slate-500 mt-1">Company Razorpay Webhook Signature Verified</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
