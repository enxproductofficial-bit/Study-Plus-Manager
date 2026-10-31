"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Armchair,
  IndianRupee,
  QrCode,
  Users2,
  FileSpreadsheet,
  Bell,
  FileText,
  Settings,
  Headphones,
  BookOpen,
  Building2,
  CreditCard,
  Layers,
  BarChart3,
  ShieldAlert,
  UserCheck,
  Receipt,
  User,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "students"
  | "admission"
  | "seats"
  | "fees"
  | "attendance"
  | "enquiries"
  | "expenses"
  | "notices"
  | "reports"
  | "settings"
  | "staff"
  | "libraries"
  | "subscriptions"
  | "payments"
  | "analytics"
  | "audit"
  | "profile"
  | "receipts";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userRole,
}) => {
  // Navigation item configurations per Section 12 of the SRS & prompt
  const getNavItems = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return [
          { id: "dashboard" as NavTab, label: "Platform Overview", icon: LayoutDashboard },
          { id: "libraries" as NavTab, label: "Registered Libraries", icon: Building2 },
          { id: "subscriptions" as NavTab, label: "SaaS Subscriptions", icon: Layers },
          { id: "payments" as NavTab, label: "Platform Payments", icon: CreditCard },
          { id: "analytics" as NavTab, label: "Platform Analytics", icon: BarChart3 },
          { id: "reports" as NavTab, label: "Platform Reports", icon: FileText },
          { id: "notices" as NavTab, label: "Broadcast Alerts", icon: Bell },
          { id: "audit" as NavTab, label: "Audit & Security Logs", icon: ShieldAlert },
          { id: "settings" as NavTab, label: "Platform Settings", icon: Settings },
        ];

      case "OWNER":
        return [
          { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
          { id: "students" as NavTab, label: "Student Management", icon: Users },
          { id: "admission" as NavTab, label: "Digital Admissions", icon: UserPlus },
          { id: "seats" as NavTab, label: "Live Seat Matrix", icon: Armchair },
          { id: "fees" as NavTab, label: "Fees & Accounts", icon: IndianRupee },
          { id: "enquiries" as NavTab, label: "Sales & Enquiries", icon: Users2 },
          { id: "expenses" as NavTab, label: "Income & Expenses (P&L)", icon: FileSpreadsheet },
          { id: "staff" as NavTab, label: "Staff Management", icon: UserCheck },
          { id: "reports" as NavTab, label: "Analytics & Reports", icon: FileText },
          { id: "notices" as NavTab, label: "Dual WhatsApp Alerts", icon: Bell },
          { id: "settings" as NavTab, label: "Library Settings", icon: Settings },
        ];

      case "STAFF":
        return [
          { id: "dashboard" as NavTab, label: "Counter Overview", icon: LayoutDashboard },
          { id: "admission" as NavTab, label: "Walk-in Admission", icon: UserPlus },
          { id: "students" as NavTab, label: "Student Directory", icon: Users },
          { id: "seats" as NavTab, label: "Seat Allocation", icon: Armchair },
          { id: "attendance" as NavTab, label: "Camera QR Scanner", icon: QrCode },
          { id: "fees" as NavTab, label: "Fee Collection & Receipt", icon: IndianRupee },
          { id: "enquiries" as NavTab, label: "Front-Desk Enquiries", icon: Users2 },
          { id: "notices" as NavTab, label: "Student Alerts", icon: Bell },
          { id: "reports" as NavTab, label: "Daily Counter Logs", icon: FileText },
        ];

      case "STUDENT":
        return [
          { id: "dashboard" as NavTab, label: "My Dashboard", icon: LayoutDashboard },
          { id: "profile" as NavTab, label: "My Profile", icon: User },
          { id: "seats" as NavTab, label: "My Allotted Seat", icon: Armchair },
          { id: "attendance" as NavTab, label: "My Attendance", icon: QrCode },
          { id: "fees" as NavTab, label: "Fee History & Pay", icon: IndianRupee },
          { id: "receipts" as NavTab, label: "Download Receipts", icon: Receipt },
          { id: "notices" as NavTab, label: "Notices & Announcements", icon: Bell },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-[#0c192e] text-slate-200 flex-shrink-0 select-none border-r border-slate-800/80">
      {/* Top Header / Brand Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25">
            <BookOpen className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white leading-tight">
              GranthSetu
            </span>
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
              {userRole === "SUPER_ADMIN"
                ? "Platform Admin"
                : userRole === "OWNER"
                ? "Owner Portal"
                : userRole === "STAFF"
                ? "Staff Counter"
                : "Student Self-Service"}
            </span>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="space-y-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Support Widget (Direct Enterprenex Support) */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900/90 p-3 border border-slate-800 shadow-xs">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Headphones className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-300">Enterprenex Helpline</p>
            <a
              href="tel:+919226860060"
              className="font-mono text-[11px] font-bold text-indigo-400 hover:underline block"
            >
              +91-9226860060
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
