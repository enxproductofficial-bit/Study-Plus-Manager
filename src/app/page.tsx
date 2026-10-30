"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { SeatMap } from "@/components/seats/SeatMap";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { FeeManager } from "@/components/fees/FeeManager";
import { AttendanceScanner } from "@/components/attendance/AttendanceScanner";
import { DualMessageHub } from "@/components/messaging/DualMessageHub";
import { LedgerView } from "@/components/ledger/LedgerView";
import { AuthPage, AuthUser } from "@/components/auth/AuthPage";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentBranch, setCurrentBranch] = useState("Main Branch - Shivaji Nagar");

  // Restore authenticated session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("granthsetu_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        if (parsed.branchName) {
          setCurrentBranch(parsed.branchName);
        }
      }
    } catch (e) {
      console.error("Auth restore error:", e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("granthsetu_user");
    setCurrentUser(null);
    setCurrentTab("dashboard");
  };

  // While restoring auth session, avoid flickering
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 font-sans text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Initializing GranthSetu...
          </span>
        </div>
      </div>
    );
  }

  // If user is not logged in, enforce Auth Login & Signup Screen
  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.branchName) {
            setCurrentBranch(user.branchName);
          }
        }}
      />
    );
  }

  const userRole = currentUser.role;
  const userName = currentUser.name;

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
          onLogout={handleLogout}
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
                <div className="mt-4 text-xs font-semibold text-slate-500">
                  Logged in as: <span className="text-blue-600 font-bold">{userName}</span> ({userRole}) | Branch Code: <span className="font-mono">{currentUser.branchCode || "BR-01"}</span>
                </div>
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
