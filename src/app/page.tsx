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
import { StudentManager } from "@/components/students/StudentManager";
import { EnquiryCrm } from "@/components/admissions/EnquiryCrm";
import { LibrarySettings } from "@/components/settings/LibrarySettings";
import { KycDocumentManager } from "@/components/admissions/KycDocumentManager";
import { AuthPage, AuthUser } from "@/components/auth/AuthPage";
import { LandingPage } from "@/components/landing/LandingPage";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [viewMode, setViewMode] = useState<"landing" | "app" | "auth">("landing");
  const [authInitialTab, setAuthInitialTab] = useState<"LOGIN" | "SIGNUP">("LOGIN");
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
    setViewMode("landing");
    setCurrentTab("dashboard");
  };

  // While restoring auth session, avoid flickering
  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white font-sans text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Loading GranthSetu...
          </span>
        </div>
      </div>
    );
  }

  // 1. PUBLIC SAAS MARKETING LANDING PAGE (Primary Entry Point)
  if (viewMode === "landing") {
    return (
      <LandingPage
        currentUser={currentUser}
        onOpenAuth={(initialTab = "LOGIN") => {
          setAuthInitialTab(initialTab);
          setViewMode("auth");
        }}
        onOpenApp={() => {
          if (currentUser) {
            setViewMode("app");
          } else {
            setAuthInitialTab("LOGIN");
            setViewMode("auth");
          }
        }}
      />
    );
  }

  // 2. AUTHENTICATION SCREEN (Login & Register)
  if (viewMode === "auth") {
    return (
      <AuthPage
        initialTab={authInitialTab}
        onBackToLanding={() => setViewMode("landing")}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.branchName) {
            setCurrentBranch(user.branchName);
          }
          if (user.role === "SUPER_ADMIN") {
            window.location.href = "/super-admin";
          } else if (user.role === "STUDENT") {
            window.location.href = "/student";
          } else {
            setViewMode("app");
          }
        }}
      />
    );
  }

  // 3. AUTHENTICATED MANAGEMENT APPLICATION
  const userRole = currentUser?.role || "OWNER";
  const userName = currentUser?.name || "Adhyaksha (Owner)";

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
          onSwitchToLanding={() => setViewMode("landing")}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-7xl">
            {currentTab === "dashboard" && (
              <OverviewDashboard onNavigate={setCurrentTab} userRole={userRole} />
            )}
            {currentTab === "students" && (
              <StudentManager
                userRole={userRole}
                onNavigateToAdmission={() => setCurrentTab("admission")}
              />
            )}
            {currentTab === "seats" && <SeatMap />}
            {currentTab === "admission" && <AdmissionForm />}
            {currentTab === "fees" && <FeeManager />}
            {currentTab === "attendance" && <AttendanceScanner />}
            {currentTab === "notices" && <DualMessageHub />}
            {(currentTab === "expenses" || currentTab === "reports") && userRole === "OWNER" && <LedgerView />}
            {currentTab === "enquiries" && (
              <EnquiryCrm
                onConvertToAdmission={(enq) => {
                  setCurrentTab("admission");
                }}
              />
            )}
            {currentTab === "staff" && userRole === "OWNER" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    Staff Accounts & Role-Based Access Control
                  </h3>
                  <span className="text-xs text-indigo-600 font-semibold">1 Active Staff Member</span>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Desk Officer (Staff)</div>
                    <div className="text-slate-500 dark:text-slate-400">Mobile: 9876543211 • Branch: {currentBranch}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      Front Desk
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
            {currentTab === "settings" && <LibrarySettings />}

            {/* Platform Attribution */}
            <div className="mt-10 border-t border-slate-200/80 pt-5 pb-3 text-center dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                GranthSetu – Abhyasika Management System.
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Powered by ENTERPRENEX SOLUTION PVT LTD
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
