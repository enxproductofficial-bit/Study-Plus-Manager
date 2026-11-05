"use client";

import React, { useState, useEffect } from "react";
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
import { StudentManager } from "@/components/students/StudentManager";
import { EnquiryCrm } from "@/components/admissions/EnquiryCrm";
import { LibrarySettings } from "@/components/settings/LibrarySettings";
import { KycDocumentManager } from "@/components/admissions/KycDocumentManager";
import { ArrowLeft, Sparkles, Building2, ExternalLink, ShieldCheck, Lock, LogIn } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function OwnerPortalPage() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("Adhyaksha (Owner)");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("granthsetu_user");
      if (stored && stored !== "undefined" && stored !== "null") {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === "OWNER" || parsed.role === "SUPER_ADMIN")) {
          setIsAuthenticated(true);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.branchName) setCurrentBranch(parsed.branchName);
          return;
        }
      }
    } catch {}
    setIsAuthenticated(false);
  }, []);

  // While checking session
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 font-sans text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Verifying Owner Credentials...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated, enforce Sign In (Zero direct bypass)
  if (isAuthenticated === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-4 font-sans text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Lock className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Owner Sign-In Required
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              This portal contains sensitive student records and financial ledgers. Please sign in with your credentials to access the Owner Portal.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition active:scale-98"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Access Owner Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
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
          userName={userName}
          onLogout={() => {
            localStorage.removeItem("granthsetu_user");
            window.location.href = "/";
          }}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-7xl">
            {/* Owner Top Status Indicator */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-3.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {t("owner_portal")}
                </span>
                <span>
                  {t("admin_overview")} • <strong>{currentBranch}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t("live_sync")}
                </span>
              </div>
            </div>

            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole="OWNER" />
            )}
            {currentTab === "students" && (
              <StudentManager
                userRole="OWNER"
                onNavigateToAdmission={() => setCurrentTab("admission")}
              />
            )}
            {currentTab === "seats" && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {(currentTab === "expenses" || currentTab === "reports") && <LedgerView />}
            {currentTab === "enquiries" && (
              <EnquiryCrm
                onConvertToAdmission={(enq) => {
                  setCurrentTab("admission");
                }}
              />
            )}
            {currentTab === "staff" && (
              <div className="space-y-4">
                <KycDocumentManager />
              </div>
            )}
            {currentTab === "settings" && <LibrarySettings />}
          </div>
        </main>
      </div>
    </div>
  );
}
