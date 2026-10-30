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
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

export default function StaffPortalPage() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7fb] dark:bg-slate-950 font-sans">
      {/* Sidebar Navigation - Scoped strictly to STAFF */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole="STAFF"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentBranch={currentBranch}
          onBranchChange={setCurrentBranch}
          userRole="STAFF"
          userName="Desk Officer (Staff)"
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
            {/* Staff Revenue Wall Notice (FR-ST-3 Enforced) */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                  STAFF COUNTER
                </span>
                <span>
                  Logged in as Front-Desk Staff. Operational actions (Admissions, Attendance, Desk Allotment, Receipts) are enabled.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>Owner P&L & Total Revenue Walled (FR-ST-3)</span>
              </div>
            </div>

            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole="STAFF" />
            )}
            {(currentTab === "seats" || currentTab === "students") && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {currentTab === "enquiries" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Front-Desk Walk-In Enquiries
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Record walk-in candidate details, course preferences, and convert to admission with 1 click.
                </p>
              </div>
            )}
            {currentTab === "reports" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Daily Front-Desk Shift Report
                </h3>
                <p className="text-xs text-slate-400">
                  Export attendance logs and walk-in records for {currentBranch}.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => alert("Daily Staff Log generated successfully!")}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Export Today's Desk Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
