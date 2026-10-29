"use client";

import React from "react";
import {
  Armchair,
  IndianRupee,
  Users,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import { NavTab } from "../layout/Sidebar";

interface OverviewProps {
  onNavigate: (tab: NavTab) => void;
  userRole: "OWNER" | "STAFF" | "STUDENT";
}

export const OverviewDashboard: React.FC<OverviewProps> = ({
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live System • Shivaji Nagar Branch
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            GranthSetu
          </h1>
          <p className="text-xl font-semibold text-indigo-300">
            Abhyasika Management System.
          </p>
          <div className="inline-block rounded-md bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200 border border-indigo-400/30">
            Powered by ENTERPRENEX SOLUTION PVT LTD
          </div>
          <p className="text-sm text-slate-300">
            Automating admissions, seat reservations, dual parent-student notifications, and fee reconciliations.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate("admission")}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              + New Admission & eKYC
            </button>
            <button
              onClick={() => onNavigate("seats")}
              className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              View Live Seat Matrix →
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Occupancy */}
        <div
          onClick={() => onNavigate("seats")}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
            <Armchair className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">71%</span>
            <span className="text-xs font-bold text-emerald-600">34 / 48 Seats</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">14 vacant in Morning Shift</p>
        </div>

        {/* Collections */}
        <div
          onClick={() => onNavigate("fees")}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Fees</span>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹3,800</span>
            <span className="text-xs font-bold text-emerald-600">+12% vs y&apos;day</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Razorpay + Direct Cash</p>
        </div>

        {/* Pending Dues */}
        <div
          onClick={() => onNavigate("fees")}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-rose-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Dues</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">₹2,600</span>
            <span className="text-xs text-slate-400">2 students</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Dual reminders ready to send</p>
        </div>

        {/* Live Attendance */}
        <div
          onClick={() => onNavigate("attendance")}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Present Today</span>
            <QrCode className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">29</span>
            <span className="text-xs text-indigo-600 font-semibold">avg 6.4 hrs</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">QR attendance scanner active</p>
        </div>
      </div>

      {/* Two Column Layout: Roadmap Milestones & Quick Ops */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Operations Matrix */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Quick Module Shortcuts</h3>
            <span className="text-xs text-indigo-600 font-semibold">GranthSetu Operations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate("admission")}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-500 hover:bg-indigo-50/20 transition-all dark:border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Student Admission</h4>
                <p className="text-xs text-slate-400">Capture OTP, eKYC, photo & seat allotment</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate("seats")}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-500 hover:bg-indigo-50/20 transition-all dark:border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Armchair className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Seat Matrix</h4>
                <p className="text-xs text-slate-400">Inspect live seats, shifts & double booking</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate("fees")}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-500 hover:bg-indigo-50/20 transition-all dark:border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Fee Collections</h4>
                <p className="text-xs text-slate-400">Collect partial fees, issue receipts & reminders</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate("attendance")}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-500 hover:bg-indigo-50/20 transition-all dark:border-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">QR Punch Desk</h4>
                <p className="text-xs text-slate-400">Scan ID card QR code for check-in/out</p>
              </div>
            </button>
          </div>
        </div>

        {/* Roadmap & Milestone Tracker (from PDF) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">14-Week Roadmap Progress</h3>
            <span className="text-xs font-bold text-indigo-600">v2 Updated</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                ✓
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">P1: Foundation (W1-2)</p>
                <p className="text-[11px] text-slate-400">Next.js + Tailwind + PostgreSQL Schema</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-indigo-50/60 p-3 border border-indigo-200 dark:border-indigo-900 dark:bg-indigo-950/40">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                2
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">P2: Core Operations (W3-5)</p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">Admission form, Seat map & QR ID</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 opacity-60 dark:bg-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-bold dark:bg-slate-700 dark:text-slate-200">
                3
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">P3: Money & Payments (W6-8)</p>
                <p className="text-[11px] text-slate-400">Razorpay webhooks & dual messaging</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 opacity-60 dark:bg-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-700 text-[11px] font-bold dark:bg-slate-700 dark:text-slate-200">
                4
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">P4: Ops & MVP Demo (W9-10)</p>
                <p className="text-[11px] text-slate-400">QR attendance scanner & dashboards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

