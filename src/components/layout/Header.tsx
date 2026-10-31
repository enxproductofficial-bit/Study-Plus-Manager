"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { useTranslation, LANGUAGE_OPTIONS, SupportedLanguage } from "@/lib/i18n";

interface HeaderProps {
  currentBranch: string;
  onBranchChange: (branch: string) => void;
  userRole: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
  userName: string;
  onToggleRole?: () => void;
  onLogout?: () => void;
  onSwitchToLanding?: () => void;
  currentLang?: string;
  onLangChange?: (lang: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch,
  onBranchChange,
  userRole,
  userName,
  onToggleRole,
  onLogout,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    // Check initial dark mode from document or storage
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLangChange = (newLang: SupportedLanguage) => {
    setLang(newLang);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* Search Input Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right Controls: 10-Language Switcher, Dark/Light Mode, Branch Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Multi-Language Selector (10 Languages: Telugu, English, Marathi, Hindi, etc.) */}
        <div className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/60 dark:border-teal-900/60 dark:bg-teal-950/40 px-2.5 py-1 text-xs font-semibold text-teal-900 dark:text-teal-200 shadow-2xs">
          <Languages className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as SupportedLanguage)}
            className="bg-transparent text-xs font-bold text-teal-950 dark:text-teal-100 focus:outline-none cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option
                key={opt.code}
                value={opt.code}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-semibold"
              >
                {opt.nativeName} ({opt.name})
              </option>
            ))}
          </select>
        </div>

        {/* Dark / Light Mode Manual Toggle (Photo 3 Item VI) */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Multi-Branch Selector */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Building2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBranch}</span>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Profile Block */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2.5 sm:pl-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-teal-500 text-white font-semibold text-sm shadow-xs ring-2 ring-teal-500/20">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5 text-teal-600 dark:text-teal-400" />
                {userRole === "OWNER" ? t("owner_portal") : userRole === "SUPER_ADMIN" ? "Super Admin" : "Staff"}
              </span>
            </div>
          </div>

          {/* Sign Out Button (Photo 3 Item VI) */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out of GranthSetu"
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{t("sign_out")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
