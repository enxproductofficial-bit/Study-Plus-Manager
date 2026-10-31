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
import { StudentManager } from "@/components/students/StudentManager";
import { EnquiryCrm } from "@/components/admissions/EnquiryCrm";
import { LibrarySettings } from "@/components/settings/LibrarySettings";
import { KycDocumentManager } from "@/components/admissions/KycDocumentManager";
import { ArrowLeft, Sparkles, Building2, ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function OwnerPortalPage() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");

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
          userName="Adhyaksha (Owner)"
          onLogout={() => {
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
