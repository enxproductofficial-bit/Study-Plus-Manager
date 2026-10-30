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
  | "settings";

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
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard, allowedRoles: ["OWNER", "STAFF"] },
    { id: "students" as NavTab, label: "Students", icon: Users, allowedRoles: ["OWNER", "STAFF"] },
    { id: "admission" as NavTab, label: "Admissions", icon: UserPlus, allowedRoles: ["OWNER", "STAFF"] },
    { id: "seats" as NavTab, label: "Room/Seat Booking", icon: Armchair, allowedRoles: ["OWNER", "STAFF"] },
    { id: "fees" as NavTab, label: "Fee Management", icon: IndianRupee, allowedRoles: ["OWNER", "STAFF"] },
    { id: "attendance" as NavTab, label: "Attendance", icon: QrCode, allowedRoles: ["OWNER", "STAFF"] },
    { id: "enquiries" as NavTab, label: "Sales Enquiries", icon: Users2, allowedRoles: ["OWNER", "STAFF"] },
    { id: "notices" as NavTab, label: "Notices & Alerts", icon: Bell, allowedRoles: ["OWNER", "STAFF"] },
    { id: "expenses" as NavTab, label: "Expenses (P&L)", icon: FileSpreadsheet, allowedRoles: ["OWNER"] }, // Restricted to Owner
    { id: "reports" as NavTab, label: "Reports", icon: FileText, allowedRoles: ["OWNER", "STAFF"] },
    { id: "settings" as NavTab, label: "Settings", icon: Settings, allowedRoles: ["OWNER"] },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-[#0e1d38] text-slate-100 flex-shrink-0 select-none">
      {/* Top Header / Brand Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <BookOpen className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-tight">
              GranthSetu
            </span>
            <span className="text-[10px] font-medium text-blue-300 tracking-wide uppercase">
              Study • Focus • Grow
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navItems
            .filter((item) => item.allowedRoles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-[13.5px] font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30"
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
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#14284d] p-3.5 border border-blue-900/40 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
            <Headphones className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-slate-300">Enterprenex Support</p>
            <p className="text-[10px] text-slate-400">Helpline & WhatsApp</p>
            <a
              href="tel:+919226860060"
              className="font-mono text-xs font-bold text-blue-400 tracking-wide hover:underline"
            >
              +91-9226860060
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
