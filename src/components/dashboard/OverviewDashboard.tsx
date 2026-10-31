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
} from "lucide-react";
import { NavTab } from "../layout/Sidebar";

interface OverviewProps {
  onNavigate: (tab: NavTab) => void;
  userRole: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  onNavigate,
  userRole,
}) => {
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);

  // Fetch live statistics from Neon PostgreSQL
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Stats fetch error:", err));
  }, []);

  const handleSendReminder = (studentName: string, amount: number) => {
    setReminderToast(`Dual WhatsApp & SMS fee reminder of ₹${amount.toLocaleString("en-IN")} dispatched to ${studentName} and Parent!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const stats = statsData?.stats || {
    totalStudents: 248,
    studentsGrowth: "+12%",
    totalSeats: 220,
    occupiedSeats: 192,
    availableSeats: 28,
    occupancyRate: 87,
    feesCollected: 328500,
    feesGrowth: "+18%",
    pendingFees: 76200,
    pendingStudentsCount: 42,
  };

  const recentAdmissions = statsData?.recentAdmissions || [
    { id: "1", index: 1, name: "Aditya Patil", seat: "A-12", plan: "Full Time", date: "29 Oct 2026" },
    { id: "2", index: 2, name: "Sneha Deshmukh", seat: "B-05", plan: "Full Time", date: "28 Oct 2026" },
    { id: "3", index: 3, name: "Rohit Jadhav", seat: "C-11", plan: "Half Time", date: "27 Oct 2026" },
    { id: "4", index: 4, name: "Pooja Sharma", seat: "A-07", plan: "Full Time", date: "27 Oct 2026" },
    { id: "5", index: 5, name: "Omkar More", seat: "B-14", plan: "Half Time", date: "26 Oct 2026" },
  ];

  const pendingFeesList = statsData?.pendingFeesList || [
    { id: "f1", index: 1, studentName: "Rahul Suryavanshi", amount: 6000, dueDate: "15 Oct 2026", daysOverdue: 14 },
    { id: "f2", index: 2, studentName: "Priya Gaikwad", amount: 5500, dueDate: "18 Oct 2026", daysOverdue: 11 },
    { id: "f3", index: 3, studentName: "Sagar Shinde", amount: 6000, dueDate: "20 Oct 2026", daysOverdue: 9 },
    { id: "f4", index: 4, studentName: "Neha Kakde", amount: 4500, dueDate: "22 Oct 2026", daysOverdue: 7 },
    { id: "f5", index: 5, studentName: "Tejas Patil", amount: 6000, dueDate: "25 Oct 2026", daysOverdue: 4 },
  ];

  const attendance = statsData?.attendance || {
    present: 186,
    absent: 42,
    notMarked: 20,
    percentage: 78,
  };

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
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-xs font-semibold text-emerald-900 shadow-xl dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back, {userRole === "OWNER" ? "Owner" : "Admin"}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here&apos;s what&apos;s happening at GranthSetu Abhyasika today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Calendar className="h-3.5 w-3.5 text-blue-600" />
          <span>Wed, 29 Oct 2026</span>
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
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {stats.totalStudents}
            </div>
            <span className="text-[11px] text-slate-400">vs last month</span>
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
              {stats.occupancyRate}% Occupancy
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Occupied Seats</span>
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
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fees Collected</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ₹{Number(stats.feesCollected).toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-slate-400">This Month</span>
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
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Fees</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              ₹{Number(stats.pendingFees).toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-400">{stats.pendingStudentsCount} Students</span>
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
        {/* Left: Recent Admissions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Admissions
            </h3>
            <button
              onClick={() => onNavigate("admission")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Name</th>
                  <th className="py-2.5 px-2">Room/Seat</th>
                  <th className="py-2.5 px-2">Plan</th>
                  <th className="py-2.5 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAdmissions.map((adm: any) => (
                  <tr key={adm.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-2 font-mono text-slate-400">{adm.index}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] dark:bg-blue-900 dark:text-blue-200">
                          {adm.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {adm.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {adm.seat}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {adm.plan}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-slate-400">
                      {adm.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pending Fees Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pending Fees
            </h3>
            <button
              onClick={() => onNavigate("fees")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Name</th>
                  <th className="py-2.5 px-2">Amount</th>
                  <th className="py-2.5 px-2">Due Date</th>
                  <th className="py-2.5 px-2 text-center">Days</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingFeesList.map((fee: any) => (
                  <tr key={fee.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-2 font-mono text-slate-400">{fee.index}</td>
                    <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200">
                      {fee.studentName}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-slate-900 dark:text-white">
                      ₹{fee.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 font-medium">
                      {fee.dueDate}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-rose-500 font-mono">
                      {fee.daysOverdue}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => handleSendReminder(fee.studentName, fee.amount)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 transition-all dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                      >
                        <Send className="h-3 w-3" />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: TODAY'S ATTENDANCE, NOTICES & ANNOUNCEMENTS, UPCOMING EVENTS       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 1. Today's Attendance (Donut) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Today&apos;s Attendance
            </h3>
            <button
              onClick={() => onNavigate("attendance")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View Details →
            </button>
          </div>

          <div className="py-4 flex flex-col items-center">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-rose-500"
                  strokeWidth="12"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 * (1 - 0.22)}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-emerald-500"
                  strokeWidth="12"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 * (1 - 0.78)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {attendance.percentage}%
                </span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full space-y-2 mt-3 px-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Present</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {attendance.present}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-300">Absent</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {attendance.absent}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-300">Not Marked</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {attendance.notMarked}
                </span>
              </div>
            </div>
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
    </div>
  );
};
