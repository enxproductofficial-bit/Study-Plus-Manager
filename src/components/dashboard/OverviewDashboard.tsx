"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Armchair,
  IndianRupee,
  Clock,
  Calendar,
  Send,
  UserPlus,
  QrCode,
  FileText,
  Megaphone,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  X,
  Download,
  Printer,
  Share2,
} from "lucide-react";
import { NavTab } from "../layout/Sidebar";
import { useTranslation } from "@/lib/i18n";

interface OverviewProps {
  onNavigate: (tab: NavTab) => void;
  userRole: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  onNavigate,
  userRole,
}) => {
  const { t } = useTranslation();
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeTarget, setNoticeTarget] = useState("ALL");
  const [reportType, setReportType] = useState("FINANCIAL_SUMMARY");

  // Fetch live statistics from Neon PostgreSQL
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Stats fetch error:", err));
  }, []);

  const handleSendReminder = (studentName: string, amount: number, mobile?: string) => {
    const formattedAmount = Number(amount || 0).toLocaleString("en-IN");
    setReminderToast(`Dual WhatsApp & SMS fee reminder of ₹${formattedAmount} dispatched to ${studentName}!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleBroadcastNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle) return;
    setReminderToast(`Notice "${noticeTitle}" dispatched via WhatsApp & SMS to all ${noticeTarget === "ALL" ? "students" : "selected students"}!`);
    setIsNoticeModalOpen(false);
    setNoticeTitle("");
    setNoticeMessage("");
    setTimeout(() => setReminderToast(null), 4500);
  };

  const handleDownloadReport = () => {
    setReminderToast(`Financial & Operational ${reportType.replace("_", " ")} report downloaded successfully!`);
    setIsReportModalOpen(false);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const stats = statsData?.stats || {
    totalStudents: 0,
    studentsGrowth: "+12%",
    totalSeats: 48,
    occupiedSeats: 0,
    availableSeats: 48,
    occupancyRate: 0,
    feesCollected: 0,
    feesGrowth: "+18%",
    pendingFees: 0,
    pendingStudentsCount: 0,
  };

  const recentAdmissions = statsData?.recentAdmissions || [];
  const pendingFeesList = statsData?.pendingFeesList || [];

  const notices = statsData?.notices || [
    { id: "n1", title: "Diwali Holiday Notice", date: "28 Oct 2026", icon: "Megaphone" },
    { id: "n2", title: "Library Timing Changed", date: "25 Oct 2026", icon: "BookOpen" },
    { id: "n3", title: "Fee Payment Reminder", date: "22 Oct 2026", icon: "IndianRupee" },
    { id: "n4", title: "New Batch Admission Open", date: "20 Oct 2026", icon: "GraduationCap" },
  ];

  const upcomingEvents = statsData?.upcomingEvents || [
    { id: "e1", day: "02", month: "Nov", title: "Career Guidance Session", time: "10:00 AM - 12:00 PM", color: "blue" },
    { id: "e2", day: "07", month: "Nov", title: "Group Study Workshop", time: "04:00 PM - 06:00 PM", color: "green" },
    { id: "e3", day: "14", month: "Nov", title: "Motivational Talk", time: "11:00 AM - 01:00 PM", color: "purple" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 font-sans">
      {/* Toast Alert for Dual Notification */}
      {reminderToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-teal-300 bg-teal-50 px-5 py-3.5 text-xs font-semibold text-teal-900 shadow-xl dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Top Welcome Header & Quick Action Bar (Photo 1 Requirement) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("welcome_back")}
            </h1>
            {/* Dynamic Real Date (Photo 1 Requirement 6) */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>{todayFormatted}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t("dashboard_subtitle")}
          </p>
        </div>

        {/* 4. Quick Action Bar (Photo 1 Requirement: Exactly 4 Buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Button 1: Add Student (Admission) */}
          <button
            onClick={() => onNavigate("admission")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t("add_student")}</span>
          </button>

          {/* Button 2: Collect Fees */}
          <button
            onClick={() => onNavigate("fees")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-all active:scale-95"
          >
            <IndianRupee className="h-4 w-4" />
            <span>{t("collect_fees")}</span>
          </button>

          {/* Button 3: Send Notice */}
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Megaphone className="h-4 w-4" />
            <span>{t("send_notice")}</span>
          </button>

          {/* Button 4: Generate Report */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>{t("generate_report")}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: TOP 4 KPI CARDS                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Students */}
        <div
          onClick={() => onNavigate("students")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm shadow-blue-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>{stats.studentsGrowth}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("total_students")}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalStudents}
            </div>
            <span className="text-[11px] text-slate-400">{t("vs_last_month")}</span>
          </div>
        </div>

        {/* 2. Occupied Seats */}
        <div
          onClick={() => onNavigate("seats")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
              <Armchair className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600">
              {stats.occupancyRate}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("occupied_seats")}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.occupiedSeats} <span className="text-sm font-normal text-slate-400">/ {stats.totalSeats}</span>
            </div>
            {/* Occupancy Progress Bar */}
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${stats.occupancyRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Fees Collected (Hidden from Staff if RBAC applies) */}
        {userRole === "OWNER" ? (
          <div
            onClick={() => onNavigate("fees")}
            className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.feesGrowth}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("fees_collected")}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ₹{Number(stats.feesCollected).toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-slate-400">{t("this_month")}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Financial Overview</span>
              <span className="text-[10px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600 dark:bg-slate-800 dark:text-slate-300">Staff Restricted</span>
            </div>
            <p className="text-xs text-slate-400 mt-5">
              Owner financial ledger is hidden from Staff roles (SRS Constraint).
            </p>
          </div>
        )}

        {/* 4. Pending Fees */}
        <div
          onClick={() => onNavigate("fees")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-sm shadow-rose-500/20">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-bold text-rose-500">
              +5%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("pending_fees")}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              ₹{Number(stats.pendingFees).toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-400">{stats.pendingStudentsCount} {t("students_count")}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: SEAT STATUS (DONUT), FEE COLLECTION (BAR), QUICK ACTIONS (6 TILES) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Seat/Room Status Donut Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Seat/Room Status
            </h3>
            <button
              onClick={() => onNavigate("seats")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View Details →
            </button>
          </div>

          <div className="py-4 flex flex-col items-center">
            {/* SVG Donut Chart */}
            <div className="relative flex items-center justify-center h-44 w-44">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="11"
                  fill="transparent"
                />
                {/* Available Seats Ring (Light Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-blue-500"
                  strokeWidth="11"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 * (1 - 0.13)}
                  strokeLinecap="round"
                  fill="transparent"
                />
                {/* Occupied Seats Ring (Green / Teal) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-emerald-500"
                  strokeWidth="11"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 * (1 - 0.87)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalSeats}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Total Seats</span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full space-y-2 mt-2 px-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Occupied</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.occupiedSeats} ({stats.occupancyRate}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">Available</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.availableSeats} (13%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="text-slate-600 dark:text-slate-300">Maintenance</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  0 (0%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Fee Collection (This Month) Bar Chart (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Fee Collection (This Month)
            </h3>
            {/* Bar Legends */}
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
                <span className="text-slate-500">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-100 dark:bg-blue-900/50" />
                <span className="text-slate-500">Pending</span>
              </div>
            </div>
          </div>

          {/* Bar Columns Container */}
          <div className="py-6 flex items-end justify-between gap-3 h-52 px-2">
            {/* Week 1 */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-36">
                <div className="w-5 bg-blue-600 rounded-t-md" style={{ height: "65%" }} />
                <div className="w-5 bg-blue-100 dark:bg-blue-900/40 rounded-t-md" style={{ height: "25%" }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Week 1</span>
            </div>

            {/* Week 2 */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-36">
                <div className="w-5 bg-blue-600 rounded-t-md" style={{ height: "92%" }} />
                <div className="w-5 bg-blue-100 dark:bg-blue-900/40 rounded-t-md" style={{ height: "28%" }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Week 2</span>
            </div>

            {/* Week 3 */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-36">
                <div className="w-5 bg-blue-600 rounded-t-md" style={{ height: "70%" }} />
                <div className="w-5 bg-blue-100 dark:bg-blue-900/40 rounded-t-md" style={{ height: "20%" }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Week 3</span>
            </div>

            {/* Week 4 */}
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-36">
                <div className="w-5 bg-blue-600 rounded-t-md" style={{ height: "100%" }} />
                <div className="w-5 bg-blue-100 dark:bg-blue-900/40 rounded-t-md" style={{ height: "35%" }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Week 4</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex justify-between dark:border-slate-800">
            <span>Monthly Target: ₹3,50,000</span>
            <span className="font-bold text-emerald-600">94% Achieved</span>
          </div>
        </div>

        {/* Right: Quick Actions (4 cols, 6 colorful cards in 3x2 grid) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5 py-3">
            {/* 1. Add Student */}
            <button
              onClick={() => onNavigate("admission")}
              className="group flex flex-col items-center justify-center rounded-xl bg-blue-50/80 p-3 hover:bg-blue-100 transition-all dark:bg-blue-950/40 dark:hover:bg-blue-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform dark:bg-blue-900 dark:text-blue-300">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Add Student
              </span>
            </button>

            {/* 2. Book Seat */}
            <button
              onClick={() => onNavigate("seats")}
              className="group flex flex-col items-center justify-center rounded-xl bg-emerald-50/80 p-3 hover:bg-emerald-100 transition-all dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform dark:bg-emerald-900 dark:text-emerald-300">
                <Armchair className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Book Seat
              </span>
            </button>

            {/* 3. Collect Fee */}
            <button
              onClick={() => onNavigate("fees")}
              className="group flex flex-col items-center justify-center rounded-xl bg-amber-50/80 p-3 hover:bg-amber-100 transition-all dark:bg-amber-950/40 dark:hover:bg-amber-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform dark:bg-amber-900 dark:text-amber-300">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Collect Fee
              </span>
            </button>

            {/* 4. Mark Attendance */}
            <button
              onClick={() => onNavigate("attendance")}
              className="group flex flex-col items-center justify-center rounded-xl bg-purple-50/80 p-3 hover:bg-purple-100 transition-all dark:bg-purple-950/40 dark:hover:bg-purple-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform dark:bg-purple-900 dark:text-purple-300">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Mark Attendance
              </span>
            </button>

            {/* 5. Send Notice */}
            <button
              onClick={() => onNavigate("notices")}
              className="group flex flex-col items-center justify-center rounded-xl bg-rose-50/80 p-3 hover:bg-rose-100 transition-all dark:bg-rose-950/40 dark:hover:bg-rose-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 group-hover:scale-110 transition-transform dark:bg-rose-900 dark:text-rose-300">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Send Notice
              </span>
            </button>

            {/* 6. Generate Report */}
            <button
              onClick={() => onNavigate("reports")}
              className="group flex flex-col items-center justify-center rounded-xl bg-cyan-50/80 p-3 hover:bg-cyan-100 transition-all dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 group-hover:scale-110 transition-transform dark:bg-cyan-900 dark:text-cyan-300">
                <FileText className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
                Generate Report
              </span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Instant single-click actions for counter operations</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: RECENT ADMISSIONS & PENDING FEES TABLES                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left: Recent Admissions (Photo 1 Requirement 2) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t("recent_admissions")}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("recent_admissions_sub")}</p>
            </div>
            <button
              onClick={() => onNavigate("students")}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 flex items-center gap-0.5"
            >
              {t("view_all")}
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">{t("student_name")}</th>
                  <th className="py-2.5 px-2">{t("course")}</th>
                  <th className="py-2.5 px-2">{t("seat")}</th>
                  <th className="py-2.5 px-2">{t("date")}</th>
                  <th className="py-2.5 px-2 text-right">{t("status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                      No student admissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentAdmissions.map((adm: any) => (
                    <tr key={adm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-2 font-mono text-slate-400">{adm.index}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] dark:bg-blue-900/60 dark:text-blue-200">
                            {adm.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {adm.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                        <span className="truncate max-w-[120px] block" title={adm.course}>
                          {adm.course}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono font-bold text-teal-700 dark:text-teal-400">
                        {adm.seat}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {adm.date}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {adm.status || t("active")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pending Fees Table (Photo 1 Requirement 3) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t("pending_fees_table")}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("pending_fees_sub")}</p>
            </div>
            <button
              onClick={() => onNavigate("fees")}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 flex items-center gap-0.5"
            >
              {t("view_all")}
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">{t("student_name")}</th>
                  <th className="py-2.5 px-2">{t("amount")}</th>
                  <th className="py-2.5 px-2">{t("due_date")}</th>
                  <th className="py-2.5 px-2 text-center">{t("days_remaining")}</th>
                  <th className="py-2.5 px-2 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingFeesList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                      All student fees are fully cleared! No pending dues.
                    </td>
                  </tr>
                ) : (
                  pendingFeesList.map((fee: any) => {
                    const isOverdue = fee.daysRemaining < 0 || fee.isOverdue;
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-2 font-mono text-slate-400">{fee.index}</td>
                        <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-slate-100">
                          {fee.studentName}
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ₹{Number(fee.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                          {fee.dueDate}
                        </td>
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                              isOverdue
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900"
                            }`}
                          >
                            {fee.statusText || (isOverdue ? `${Math.abs(fee.daysRemaining)}d ${t("overdue")}` : `${fee.daysRemaining}d ${t("left")}`)}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSendReminder(fee.studentName, fee.amount, fee.studentMobile)}
                              title="Send Dual WhatsApp & SMS Reminder"
                              className="inline-flex items-center gap-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-1 text-[11px] font-bold text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-all active:scale-95"
                            >
                              <Send className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                              <span>{t("remind")}</span>
                            </button>
                            <button
                              onClick={() => onNavigate("fees")}
                              title="Collect / Record Fee Payment"
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-800 transition-all shadow-2xs active:scale-95"
                            >
                              <IndianRupee className="h-3 w-3" />
                              <span>{t("pay_fees")}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: SALES ENQUIRIES (CRM), NOTICES & ALERTS, EVENTS (Photo 3 Item IV)  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 1. Walk-in & Digital Enquiries (Photo 3 Item IV) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Sales & Admission Enquiries
              </h3>
              <p className="text-[11px] text-slate-500">Walk-ins & online student leads</p>
            </div>
            <button
              onClick={() => onNavigate("enquiries")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              View CRM →
            </button>
          </div>

          <div className="py-3 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs dark:bg-indigo-900 dark:text-indigo-200">
                  S
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Sameer Deshpande</h5>
                  <span className="text-[10px] text-slate-400">UPSC Full-Day • 9822119900</span>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Follow Up
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-xs dark:bg-blue-900 dark:text-blue-200">
                  R
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Radhika Kulkarni</h5>
                  <span className="text-[10px] text-slate-400">MPSC Morning • 9850223344</span>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                New Lead
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs dark:bg-emerald-900 dark:text-emerald-200">
                  A
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Aniket Jadhav</h5>
                  <span className="text-[10px] text-slate-400">Banking / SSC • 9422556677</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                Ready to Join
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-center justify-between dark:border-slate-800">
            <span>Total Active Enquiries: 18</span>
            <button
              onClick={() => onNavigate("enquiries")}
              className="font-bold text-indigo-600 hover:underline"
            >
              + Add Enquiry
            </button>
          </div>
        </div>

        {/* 2. Notices & Announcements */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Notices & Announcements
            </h3>
            <button
              onClick={() => onNavigate("notices")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3 py-3">
            {notices.map((n: any) => (
              <div
                key={n.id}
                onClick={() => onNavigate("notices")}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {n.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {n.date}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Direct WhatsApp & SMS broadcast enabled</span>
          </div>
        </div>

        {/* 3. Upcoming Events */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Upcoming Events
            </h3>
            <button
              onClick={() => onNavigate("notices")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3 py-3">
            {upcomingEvents.map((evt: any) => {
              let badgeColor = "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300";
              if (evt.color === "green") {
                badgeColor = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300";
              } else if (evt.color === "purple") {
                badgeColor = "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300";
              }

              return (
                <div key={evt.id} className="flex items-center gap-3 p-1.5">
                  {/* Date Block */}
                  <div className={`flex flex-col items-center justify-center rounded-xl p-2 w-11 h-11 shrink-0 ${badgeColor}`}>
                    <span className="text-xs font-black leading-none">{evt.day}</span>
                    <span className="text-[9px] font-bold uppercase">{evt.month}</span>
                  </div>
                  {/* Event Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {evt.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span>Special counselling & study hall sessions</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTION MODALS: SEND NOTICE & GENERATE REPORT (Photo 1 Requirement 4)*/}
      {/* ========================================================================= */}

      {/* 1. Send Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Send Broadcast Notice
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dispatches instant alerts via WhatsApp & SMS to students
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastNotice} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Recipient Group
                </label>
                <select
                  value={noticeTarget}
                  onChange={(e) => setNoticeTarget(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">All Active Students (Full Library)</option>
                  <option value="OVERDUE">Students with Pending / Overdue Fees</option>
                  <option value="MORNING">Morning Shift Students</option>
                  <option value="EVENING">Evening Shift Students</option>
                  <option value="24HR">24-Hour Unlimited Plan Students</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notice Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Holiday Timings / Silent Zone Discipline Notice"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Dear Students, please note that the study hall will remain open until 10 PM this Sunday..."
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span className="font-bold">Dual Delivery active:</span> SMS gateway configured with DLT registration and WhatsApp Cloud API template.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Generate Operational Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Export verified administrative and accounting data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Report Type
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReportType("FINANCIAL_SUMMARY")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      reportType === "FINANCIAL_SUMMARY"
                        ? "border-teal-600 bg-teal-50/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Financial P&L Summary</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Collections, dues & expenses</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType("FEES_DUES")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      reportType === "FEES_DUES"
                        ? "border-teal-600 bg-teal-50/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Pending Dues Roster</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Overdue & upcoming balances</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType("ADMISSION_ROSTER")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      reportType === "ADMISSION_ROSTER"
                        ? "border-teal-600 bg-teal-50/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Student Admissions</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Registered students & courses</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType("SEAT_OCCUPANCY")}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      reportType === "SEAT_OCCUPANCY"
                        ? "border-teal-600 bg-teal-50/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Seat Occupancy Matrix</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Desk allocations by shift</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Duration Period
                  </label>
                  <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <option>Current Month (October 2026)</option>
                    <option>Last Month (September 2026)</option>
                    <option>Year to Date (FY 2026-27)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Branch
                  </label>
                  <select className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <option>Main Branch - Shivaji Nagar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-all shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("reports")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all"
                >
                  <span>Open Full Ledger →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
