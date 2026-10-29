"use client";

import React, { useState } from "react";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { SeatMap } from "@/components/seats/SeatMap";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { FeeManager } from "@/components/fees/FeeManager";
import { AttendanceScanner } from "@/components/attendance/AttendanceScanner";
import { DualMessageHub } from "@/components/messaging/DualMessageHub";
import { LedgerView } from "@/components/ledger/LedgerView";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");
  const [userRole, setUserRole] = useState<"OWNER" | "STAFF" | "STUDENT">("OWNER");
  const [userName, setUserName] = useState("Adhyaksha (Owner)");

  // Toggle role between OWNER and STAFF to demonstrate Business Rule #6 (Ledger access restricted)
  const toggleRole = () => {
    if (userRole === "OWNER") {
      setUserRole("STAFF");
      setUserName("Desk Officer (Staff)");
      if (currentTab === "ledger") {
        setCurrentTab("dashboard");
      }
    } else {
      setUserRole("OWNER");
      setUserName("Adhyaksha (Owner)");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100/70 dark:bg-slate-950 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentBranch={currentBranch}
          onBranchChange={setCurrentBranch}
          userRole={userRole}
          userName={userName}
        />

        {/* Role Switcher Demo Toolbar */}
        <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/70 px-6 py-2 text-xs text-indigo-950 dark:border-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Demo Role Switcher (RBAC):</span>
            <span className="text-slate-500">Currently viewing as</span>
            <span className="rounded bg-indigo-600 px-2 py-0.5 font-bold text-white">
              {userRole}
            </span>
          </div>

          <button
            onClick={toggleRole}
            className="rounded-lg border border-indigo-300 bg-white px-2.5 py-1 font-bold text-indigo-700 shadow-sm hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300"
          >
            Switch to {userRole === "OWNER" ? "Staff View" : "Owner View"} ⇄
          </button>
        </div>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole={userRole} />
            )}
            {currentTab === "seats" && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "messages" && <DualMessageHub />}
            {currentTab === "ledger" && userRole === "OWNER" && <LedgerView />}
            {currentTab === "enquiries" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Sales & Enquiries Pipeline (Module 01)
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Track student enquiries, shift preferences, follow-up callbacks, and conversion rates.
                </p>
                <div className="mt-6 inline-flex rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Connected with Branch {currentBranch}
                </div>
              </div>
            )}

            {/* Platform Branding Footer */}
            <div className="mt-10 border-t border-slate-200 pt-6 pb-2 text-center dark:border-slate-800">
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                GranthSetu
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Abhyasika Management System.
              </div>
              <div className="mt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                Powered by ENTERPRENEX SOLUTION PVT LTD
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
