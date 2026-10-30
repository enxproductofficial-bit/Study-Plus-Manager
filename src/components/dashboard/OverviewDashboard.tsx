"use client";

import React, { useState } from "react";
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
  Bell,
  Megaphone,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { NavTab } from "../layout/Sidebar";

interface OverviewProps {
  onNavigate: (tab: NavTab) => void;
  userRole: "OWNER" | "STAFF" | "STUDENT";
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  onNavigate,
  userRole,
}) => {
  const [selectedShift, setSelectedShift] = useState<string>("ALL");
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const handleSendReminder = (studentName: string) => {
    setReminderToast(`Dual WhatsApp & SMS reminder dispatched to ${studentName} and Parent!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast Alert for Dual Notification */}
      {reminderToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-lg dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Calendar className="h-3.5 w-3.5 text-blue-600" />
          <span>Wed, 29 Oct 2026</span>
        </div>
      </div>

      {/* Row 1: Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Students */}
        <div
          onClick={() => onNavigate("students")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-blue-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/50">
              +12% vs last month
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-400">Total Students</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              248
            </div>
          </div>
        </div>

        {/* 2. Occupied Seats */}
        <div
          onClick={() => onNavigate("seats")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-emerald-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Armchair className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              87% Occupancy
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-400">Occupied Seats</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              192 <span className="text-sm font-normal text-slate-400">/ 220</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "87%" }} />
          </div>
        </div>

        {/* 3. Fees Collected (Hidden from Staff if RBAC applies) */}
        {userRole === "OWNER" ? (
          <div
            onClick={() => onNavigate("fees")}
            className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-amber-300 transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/50">
                +18%
              </span>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-400">Fees Collected</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                ₹3,28,500
              </div>
              <span className="text-[10px] text-slate-400">This Month (Razorpay + Cash)</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Financial Overview</span>
              <span className="text-[10px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600">Restricted</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Owner-level revenue is hidden from Staff accounts (Rule #6).
            </p>
          </div>
        )}

        {/* 4. Pending Fees */}
        <div
          onClick={() => onNavigate("fees")}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-rose-300 transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full dark:bg-rose-950/50">
              +5%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-400">Pending Fees</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-0.5">
              ₹76,200
            </div>
            <span className="text-[10px] text-slate-400">42 Students have dues</span>
          </div>
        </div>
      </div>

      {/* Row 2: Seat Status Donut, Fee Collection Bar Chart & Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Seat/Room Status */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Seat/Room Status</h3>
            <button
              onClick={() => onNavigate("seats")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Details →
            </button>
          </div>

          <div className="flex items-center justify-center py-6 gap-6">
            {/* Donut Chart Simulation with SVG */}
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Occupied (Green - 87%) */}
                <path
                  className="text-emerald-500"
                  strokeDasharray="87, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">220</span>
                <span className="text-[10px] text-slate-400 font-medium">Total Seats</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Occupied</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">192 (87%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 dark:text-slate-300">Available</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">28 (13%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-600 dark:text-slate-300">Maintenance</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">0 (0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Fee Collection (This Month) Bar Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Fee Collection (This Month)
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-blue-600" />
                <span className="text-slate-600 dark:text-slate-300">Collected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-blue-200" />
                <span className="text-slate-400">Pending</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-4 flex items-end justify-between gap-3 h-36 px-2">
            {[
              { label: "Week 1", collected: 65, pending: 25 },
              { label: "Week 2", collected: 85, pending: 20 },
              { label: "Week 3", collected: 70, pending: 35 },
              { label: "Week 4", collected: 95, pending: 15 },
            ].map((week) => (
              <div key={week.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-28">
                  <div
                    style={{ height: `${week.collected}%` }}
                    className="w-4 bg-blue-600 rounded-t-md transition-all hover:bg-blue-700"
                    title={`Collected: ${week.collected}%`}
                  />
                  <div
                    style={{ height: `${week.pending}%` }}
                    className="w-4 bg-blue-100 dark:bg-blue-900/40 rounded-t-md transition-all"
                    title={`Pending: ${week.pending}%`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Quick Actions (2x3 Grid) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 mb-3.5 dark:border-slate-800">
            Quick Actions
          </h3>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onNavigate("admission")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50/70 text-blue-700 hover:bg-blue-100 transition-all dark:bg-blue-950/40 dark:text-blue-300"
            >
              <UserPlus className="h-5 w-5 mb-1.5 text-blue-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Add Student</span>
            </button>

            <button
              onClick={() => onNavigate("seats")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 transition-all dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <Armchair className="h-5 w-5 mb-1.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Book Seat</span>
            </button>

            <button
              onClick={() => onNavigate("fees")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/70 text-amber-700 hover:bg-amber-100 transition-all dark:bg-amber-950/40 dark:text-amber-300"
            >
              <IndianRupee className="h-5 w-5 mb-1.5 text-amber-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Collect Fee</span>
            </button>

            <button
              onClick={() => onNavigate("attendance")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50/70 text-purple-700 hover:bg-purple-100 transition-all dark:bg-purple-950/40 dark:text-purple-300"
            >
              <QrCode className="h-5 w-5 mb-1.5 text-purple-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Mark Attendance</span>
            </button>

            <button
              onClick={() => onNavigate("notices")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50/70 text-rose-700 hover:bg-rose-100 transition-all dark:bg-rose-950/40 dark:text-rose-300"
            >
              <Megaphone className="h-5 w-5 mb-1.5 text-rose-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Send Notice</span>
            </button>

            <button
              onClick={() => onNavigate("reports")}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-50/70 text-cyan-700 hover:bg-cyan-100 transition-all dark:bg-cyan-950/40 dark:text-cyan-300"
            >
              <FileText className="h-5 w-5 mb-1.5 text-cyan-600" />
              <span className="text-[11px] font-bold text-center leading-tight">Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Admissions & Pending Fees Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Admissions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Recent Admissions</h3>
            <button
              onClick={() => onNavigate("admission")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Room/Seat</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {[
                  { id: "1", name: "Aditya Patil", seat: "A-12", plan: "Full Time", date: "29 Oct 2026" },
                  { id: "2", name: "Sneha Deshmukh", seat: "B-05", plan: "Full Time", date: "28 Oct 2026" },
                  { id: "3", name: "Rohit Jadhav", seat: "C-11", plan: "Half Time", date: "27 Oct 2026" },
                  { id: "4", name: "Pooja Sharma", seat: "A-07", plan: "Full Time", date: "27 Oct 2026" },
                  { id: "5", name: "Omkar More", seat: "B-14", plan: "Half Time", date: "26 Oct 2026" },
                ].map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 text-slate-400 font-mono">{s.id}</td>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                          {s.name.charAt(0)}
                        </span>
                        {s.name}
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300 font-mono font-medium">
                      {s.seat}
                    </td>
                    <td className="py-2.5">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {s.plan}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-right">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fees Table with 1-Click Dual Reminder */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Pending Fees</h3>
            <button
              onClick={() => onNavigate("fees")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2 font-medium">#</th>
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Due Date</th>
                  <th className="pb-2 font-medium">Days</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {[
                  { id: "1", name: "Rahul Suryavanshi", amount: "₹6,000", date: "15 Oct 2026", days: 14 },
                  { id: "2", name: "Priya Gaikwad", amount: "₹5,500", date: "18 Oct 2026", days: 11 },
                  { id: "3", name: "Sagar Shinde", amount: "₹6,000", date: "20 Oct 2026", days: 9 },
                  { id: "4", name: "Neha Kakde", amount: "₹4,500", date: "22 Oct 2026", days: 7 },
                  { id: "5", name: "Tejas Patil", amount: "₹6,000", date: "25 Oct 2026", days: 4 },
                ].map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 text-slate-400 font-mono">{f.id}</td>
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {f.name}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{f.amount}</td>
                    <td className="py-2.5 text-slate-400">{f.date}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                        {f.days}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleSendReminder(f.name)}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-all dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                      >
                        <Send className="h-2.5 w-2.5" />
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Attendance Donut, Notices & Announcements, Upcoming Seat Renewals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Today's Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Today&apos;s Attendance</h3>
            <button
              onClick={() => onNavigate("attendance")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Details →
            </button>
          </div>

          <div className="flex items-center justify-center py-4 gap-6">
            {/* Donut Chart Simulation with SVG */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="78, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">78%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Present</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">186</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300">Absent</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">42</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-600 dark:text-slate-300">Not Marked</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">20</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Notices & Announcements */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notices & Announcements</h3>
            <button
              onClick={() => onNavigate("notices")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { icon: Megaphone, color: "text-rose-500 bg-rose-50", title: "Diwali Holiday Notice", date: "28 Oct 2026" },
              { icon: BookOpen, color: "text-blue-500 bg-blue-50", title: "Library Timing Changed", date: "25 Oct 2026" },
              { icon: IndianRupee, color: "text-emerald-500 bg-emerald-50", title: "Fee Payment Reminder", date: "22 Oct 2026" },
              { icon: GraduationCap, color: "text-purple-500 bg-purple-50", title: "New Batch Admission Open", date: "20 Oct 2026" },
            ].map((n, idx) => {
              const Icon = n.icon;
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg ${n.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{n.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{n.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Upcoming Seat Renewals (Expiring Passes) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Upcoming Seat Renewals</h3>
            <button
              onClick={() => onNavigate("fees")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { day: "02", month: "Nov", color: "bg-blue-50 text-blue-700", title: "Career Guidance Session", time: "10:00 AM - 12:00 PM" },
              { day: "07", month: "Nov", color: "bg-emerald-50 text-emerald-700", title: "Group Study Workshop", time: "04:00 PM - 06:00 PM" },
              { day: "14", month: "Nov", color: "bg-purple-50 text-purple-700", title: "Motivational Talk", time: "11:00 AM - 01:00 PM" },
            ].map((e, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <div className={`flex flex-col items-center justify-center rounded-xl p-2 w-11 h-11 ${e.color} font-bold leading-tight`}>
                  <span className="text-xs">{e.day}</span>
                  <span className="text-[9px] uppercase font-semibold">{e.month}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{e.title}</h4>
                  <p className="text-[11px] text-slate-400">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
