"use client";

import React from "react";
import { 
  Building2, 
  Bell, 
  Search, 
  ShieldCheck, 
  ChevronDown 
} from "lucide-react";

interface HeaderProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  userRole: "OWNER" | "STAFF" | "STUDENT";
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch,
  onBranchChange,
  userRole,
  userName,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur transition-all dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Branch selector & Live Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
          <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-slate-700 dark:text-slate-200">Branch:</span>
          <select
            value={currentBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="cursor-pointer bg-transparent font-semibold text-indigo-700 focus:outline-none dark:text-indigo-300"
          >
            <option value="Main Branch - Shivaji Nagar">Main Branch - Shivaji Nagar</option>
            <option value="Branch 2 - FC Road">Branch 2 - FC Road</option>
            <option value="Branch 3 - Kothrud">Branch 3 - Kothrud</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>

        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:flex dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Shift: Morning (06:00 - 14:00)
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden max-w-md flex-1 px-8 lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, mobile, seat no..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        <button
          title="Notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="hidden flex-col text-left text-sm md:flex">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{userName}</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-3 w-3 text-indigo-500" />
              <span>{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

