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
      if (currentTab === "expenses" || currentTab === "reports") {
        setCurrentTab("dashboard");
      }
    } else {
      setUserRole("OWNER");
      setUserName("Adhyaksha (Owner)");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f7fb] dark:bg-slate-950 font-sans">
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
          onToggleRole={toggleRole}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-7xl">
            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole={userRole} />
            )}
            {(currentTab === "seats" || currentTab === "students") && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {(currentTab === "expenses" || currentTab === "reports") && userRole === "OWNER" && <LedgerView />}
            {currentTab === "enquiries" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Sales & Enquiries Pipeline (Module 01)
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Track student enquiries, shift preferences, follow-up callbacks, and conversion rates.
                </p>
                <div className="mt-6 inline-flex rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                  Connected with Branch: {currentBranch}
                </div>
              </div>
            )}
            {currentTab === "settings" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  GranthSetu System Settings
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Manage branches, shift timings, fee tariff plans, and Razorpay webhook configurations.
                </p>
              </div>
            )}

            {/* Platform Attribution */}
            <div className="mt-10 border-t border-slate-200/80 pt-5 pb-3 text-center dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                GranthSetu – Abhyasika Management System.
              </div>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                Powered by ENTERPRENEX SOLUTION PVT LTD
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
