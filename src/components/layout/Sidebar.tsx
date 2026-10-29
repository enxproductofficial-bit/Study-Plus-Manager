"use client";

import React from "react";
import {
  LayoutDashboard,
  Armchair,
  UserPlus,
  IndianRupee,
  QrCode,
  MessageSquare,
  FileSpreadsheet,
  Users2,
} from "lucide-react";

export type NavTab = 
  | "dashboard"
  | "seats"
  | "admission"
  | "fees"
  | "attendance"
  | "messages"
  | "ledger"
  | "enquiries";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: "OWNER" | "STAFF" | "STUDENT";
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userRole,
}) => {
  const navItems = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "seats" as NavTab,
      label: "Seat Matrix",
      icon: Armchair,
      badge: "Live",
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "admission" as NavTab,
      label: "Admissions",
      icon: UserPlus,
      badge: null,
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "fees" as NavTab,
      label: "Fee Management",
      icon: IndianRupee,
      badge: "Dues",
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "attendance" as NavTab,
      label: "QR Attendance",
      icon: QrCode,
      badge: null,
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "messages" as NavTab,
      label: "Dual Messaging",
      icon: MessageSquare,
      badge: "WhatsApp",
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "enquiries" as NavTab,
      label: "Sales / Enquiries",
      icon: Users2,
      badge: null,
      allowedRoles: ["OWNER", "STAFF"],
    },
    {
      id: "ledger" as NavTab,
      label: "Income & Expense",
      icon: FileSpreadsheet,
      badge: "Owner",
      allowedRoles: ["OWNER"], // Restrict from staff as per specs!
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 dark:border-slate-800">
      {/* Brand logo & title */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-md shadow-indigo-500/20 text-base">
          GS
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold tracking-tight text-white text-base leading-tight">
            GranthSetu
          </span>
          <span className="text-[11px] font-medium text-indigo-300 leading-tight">
            Abhyasika Management System.
          </span>
          <span className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
            Powered by ENTERPRENEX SOLUTION PVT LTD
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
        {navItems
          .filter((item) => item.allowedRoles.includes(userRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badge === "Owner"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* Footer / Role indicator */}
      <div className="border-t border-slate-800 p-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-800/60 p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Phase 1-4 Ready</span>
          </div>
          <span className="font-mono text-slate-500 text-[10px]">v2.0-MVP</span>
        </div>
        <div className="text-center text-[10px] font-medium text-slate-400">
          Powered by <span className="font-semibold text-indigo-400">ENTERPRENEX SOLUTION PVT LTD</span>
        </div>
      </div>
    </aside>
  );
};

