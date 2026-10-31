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

export default function OwnerPortalPage() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7fb] font-sans text-slate-800">
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-indigo-900 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  OWNER PORTAL
                </span>
                <span>
                  Full administrative and financial P&L visibility for <strong>{currentBranch}</strong>.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/l/studyplus-shivajinagar"
                  target="_blank"
                  className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  View Public Website <ExternalLink className="h-3 w-3" />
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  href="/super-admin"
                  className="font-semibold text-slate-600 hover:text-slate-900"
                >
                  Super Admin
                </Link>
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
