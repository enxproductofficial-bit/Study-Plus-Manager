"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentName: string;
  regNo: string;
  seatNumber: string;
  scanType: "CHECK_IN" | "CHECK_OUT";
  time: string;
  duration?: string;
}

const mockRecentScans: AttendanceRecord[] = [
  {
    id: "a1",
    studentName: "Aditya Patil",
    regNo: "STU-2026-0012",
    seatNumber: "S-08",
    scanType: "CHECK_IN",
    time: "06:12 AM",
  },
  {
    id: "a2",
    studentName: "Pooja Shinde",
    regNo: "STU-2026-0019",
    seatNumber: "S-14",
    scanType: "CHECK_OUT",
    time: "01:45 PM",
    duration: "7 hrs 20 mins",
  },
  {
    id: "a3",
    studentName: "Siddharth Rao",
    regNo: "STU-2026-0027",
    seatNumber: "S-22",
    scanType: "CHECK_IN",
    time: "06:05 AM",
  },
];

export const AttendanceScanner: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>(mockRecentScans);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) return;

    const newScan: AttendanceRecord = {
      id: `scan-${Date.now()}`,
      studentName: "Simulated Student",
      regNo: "STU-2026-0045",
      seatNumber: "S-18",
      scanType: "CHECK_IN",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRecentScans([newScan, ...recentScans]);
    setNotification(`Check-in recorded for Simulated Student (Seat S-18). Anti-duplicate active.`);
    setTokenInput("");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Scanner Terminal */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">QR Check-in / Check-out</h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Scanner
            </span>
          </div>

          {/* Camera Viewfinder Simulation */}
          <div className="relative flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
            <div className="absolute inset-4 rounded-lg border-2 border-indigo-500/50 pointer-events-none" />
            <Camera className="h-10 w-10 text-indigo-500 mb-2" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              Browser Web-Cam Ready
            </span>
            <span className="text-[11px] text-slate-400">Point student ID card QR at camera</span>
          </div>

          {/* Fallback Manual Token / Barcode Scanner Input */}
          <form onSubmit={handleSimulateScan} className="space-y-3">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Or Scan with USB Scanner / Reg No
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Scan QR token or STU ID..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
              >
                Punch
              </button>
            </div>
          </form>

          {notification && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {/* Live Attendance Activity Log */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Live Attendance Stream</h3>
              <p className="text-xs text-slate-500">Real-time study-hour tracking & anti-duplicate protection</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Today: 34 Active in Library</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${scan.scanType === "CHECK_IN"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }`}
                  >
                    {scan.scanType === "CHECK_IN" ? "IN" : "OUT"}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {scan.studentName}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {scan.regNo} • Seat {scan.seatNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {scan.time}
                  </div>
                  {scan.duration && (
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Studied: {scan.duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

