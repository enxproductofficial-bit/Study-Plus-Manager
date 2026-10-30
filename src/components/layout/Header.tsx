"use client";

import React from "react";
import { Search, Bell, Building2, ChevronDown, ShieldCheck } from "lucide-react";

interface HeaderProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  userRole: "OWNER" | "STAFF" | "STUDENT";
  userName: string;
  onToggleRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch,
  onBranchChange,
  userRole,
  userName,
  onToggleRole,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6 transition-all dark:border-slate-800 dark:bg-slate-900">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, mobile, ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right Controls: Branch Switcher, Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Multi-Branch Selector */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
          <select
            value={currentBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="bg-transparent font-medium cursor-pointer focus:outline-none text-slate-800 dark:text-slate-100"
          >
            <option value="Main Branch - Shivaji Nagar">Shivaji Nagar (Main)</option>
            <option value="Branch 2 - FC Road">FC Road Branch</option>
            <option value="Branch 3 - Kothrud">Kothrud Branch</option>
          </select>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Profile Block */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          <button
            onClick={onToggleRole}
            title="Click to toggle between Owner and Staff view (RBAC)"
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-sm ring-2 ring-blue-500/20">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors dark:text-slate-200">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5 text-blue-500" />
                {userRole === "OWNER" ? "Owner (Full Access)" : "Staff (Desk)"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
