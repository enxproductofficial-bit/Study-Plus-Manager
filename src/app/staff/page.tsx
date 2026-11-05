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
import { StudentManager } from "@/components/students/StudentManager";
import { EnquiryCrm } from "@/components/admissions/EnquiryCrm";
import { ShieldCheck, UserCheck, Lock, LogIn } from "lucide-react";

export default function StaffPortalPage() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("Desk Officer (Staff)");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("granthsetu_user");
      if (stored && stored !== "undefined" && stored !== "null") {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === "STAFF" || parsed.role === "OWNER" || parsed.role === "SUPER_ADMIN")) {
          setIsAuthenticated(true);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.branchName) setCurrentBranch(parsed.branchName);
          return;
        }
      }
    } catch {}
    setIsAuthenticated(false);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 font-sans text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Verifying Staff Access...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-4 font-sans text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Lock className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Staff Sign-In Required
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Counter operations require verified staff login. Please sign in with your staff credentials.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition active:scale-98"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Access Staff Counter</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7fb] font-sans text-slate-800">
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
          userName={userName}
          onLogout={() => {
            localStorage.removeItem("granthsetu_user");
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  STAFF COUNTER
                </span>
                <span>
                  Logged in as Front-Desk Staff. Operational actions (Admissions, Attendance, Desk Allotment, Receipts) are enabled.
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>Owner P&L & Total Revenue Walled (FR-ST-3)</span>
              </div>
            </div>

            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole="STAFF" />
            )}
            {currentTab === "students" && (
              <StudentManager
                userRole="STAFF"
                onNavigateToAdmission={() => setCurrentTab("admission")}
              />
            )}
            {currentTab === "seats" && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {currentTab === "enquiries" && (
              <EnquiryCrm
                onConvertToAdmission={(enq) => {
                  setCurrentTab("admission");
                }}
              />
            )}
            {currentTab === "reports" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <h3 className="font-bold text-base text-slate-900">
                  Daily Front-Desk Shift Report
                </h3>
                <p className="text-xs text-slate-500">
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
