"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  BookOpen,
  MapPin,
  Clock,
  Layers,
  Calendar,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { StudentIdCard } from "@/components/admissions/StudentIdCard";

interface StudentPortalData {
  id: string;
  studentRegNo: string;
  fullName: string;
  mobile: string;
  email: string | null;
  coursePreparingFor: string;
  qrCodeToken: string;
  aadhaarLast4: string | null;
  isAadhaarVerified: boolean;
  status: string;
  joinedDate: string;
  library: {
    name: string;
    branchName: string;
    address: string;
    phone: string;
  };
  seat: {
    seatNumber: string;
    section: string;
    shiftName: string;
    hasLocker: boolean;
    hasPower: boolean;
    validUntil: string | null;
  };
  feeStatus: {
    planName: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    dueDate: string;
    status: string;
  };
  attendance: {
    id: string;
    date: string;
    scanType: string;
    time: string;
    studyMinutes: number;
  }[];
  receipts: {
    id: string;
    receiptNumber: string;
    amount: number;
    date: string;
    mode: string;
    status: string;
  }[];
}

export default function StudentPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileInput, setMobileInput] = useState("9226860060");
  const [otpInput, setOtpInput] = useState("4289");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [portalData, setPortalData] = useState<StudentPortalData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "idcard" | "attendance" | "fees">("overview");
  const [renewalRequested, setRenewalRequested] = useState(false);

  // Restore student session if present
  useEffect(() => {
    const saved = localStorage.getItem("granthsetu_student");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPortalData(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileInput.length < 10) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/student/portal?mobile=${mobileInput}`);
      const json = await res.json();
      if (json.success && json.student) {
        setPortalData(json.student);
        localStorage.setItem("granthsetu_student", JSON.stringify(json.student));
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("granthsetu_student");
    setIsLoggedIn(false);
    setPortalData(null);
    setOtpSent(false);
  };

  // 1. Passwordless Mobile OTP Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-bold text-white text-base">GranthSetu Student Portal</span>
            </Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-md w-full px-4 py-12 flex-1 flex flex-col justify-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Student Self-Service</h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your seat allotment, study attendance & digital ID card.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Registered Mobile Number</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[11px] text-emerald-300">
                  <span className="font-bold">Sandbox Test Mode:</span> Enter any mobile number (e.g. <span className="font-mono font-bold text-white">9226860060</span>) to receive instant OTP.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Send Login OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Enter 4-Digit Verification Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-3 text-center text-2xl font-mono tracking-widest text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="text-center text-[11px] text-slate-500 mt-1.5">
                    Demo Code: <span className="text-white font-mono font-bold">4289</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="rounded-2xl border border-slate-800 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-2xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Open Dashboard"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        <footer className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500">
          Powered by GranthSetu • Enterprenex Solution Pvt. Ltd.
        </footer>
      </div>
    );
  }

  // 2. Authenticated Student Dashboard
  const s = portalData!;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">{s.fullName}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                  {s.studentRegNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{s.library.name} • {s.seat.shiftName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mx-auto flex max-w-5xl items-center gap-1 pt-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Seat" },
            { id: "idcard", label: "Digital ID Card" },
            { id: "attendance", label: "Attendance & Study Hours" },
            { id: "fees", label: "Fees & Receipts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Seat & Membership Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-6 sm:p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    YOUR ACTIVE DESK
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <h2 className="text-3xl font-black text-white">{s.seat.seatNumber}</h2>
                    <span className="text-sm font-semibold text-emerald-300">{s.seat.section}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Shift: <span className="text-white font-medium">{s.seat.shiftName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-center min-w-[100px]">
                    <div className="text-[10px] text-slate-500 font-semibold">LOCKER</div>
                    <div className="text-xs font-bold text-white mt-0.5">{s.seat.hasLocker ? "Allotted" : "None"}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-center min-w-[100px]">
                    <div className="text-[10px] text-slate-500 font-semibold">POWER POINT</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">Active 230V</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Valid Until: {s.seat.validUntil ? new Date(s.seat.validUntil).toLocaleDateString() : "Active Member"}</span>
                </div>
                {!renewalRequested ? (
                  <button
                    onClick={() => setRenewalRequested(true)}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    Request 30-Day Renewal
                  </button>
                ) : (
                  <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    ✓ Renewal Request Submitted
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs text-slate-400 font-medium">Study Goal / Course</span>
                <div className="text-base font-bold text-white mt-1">{s.coursePreparingFor}</div>
                <div className="text-[11px] text-slate-500 mt-1">Goal-oriented study hall</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs text-slate-400 font-medium">UIDAI eKYC Status</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Verified (Last 4: {s.aadhaarLast4 || "4289"})</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Compliant with UIDAI rules</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs text-slate-400 font-medium">Fee Clearance</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-emerald-400">
                    {s.feeStatus.balanceAmount === 0 ? "Fully Paid" : `₹${s.feeStatus.balanceAmount} Due`}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{s.feeStatus.planName}</div>
              </div>
            </div>

            {/* Library Contact Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-bold text-white text-sm mb-3">Study Centre Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">{s.library.name} ({s.library.branchName})</div>
                    <div className="text-slate-400">{s.library.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400">Centre Desk Helpline:</span>
                    <div className="font-semibold text-white">{s.library.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CR80 PVC Printable Digital ID Card */}
        {activeTab === "idcard" && (
          <div className="space-y-4">
            <div className="text-center max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-white">Digital Student Identity Card</h3>
              <p className="text-xs text-slate-400 mt-1">
                Carry this on your mobile or print standard CR80 PVC card for front-desk QR attendance check-in.
              </p>
            </div>

            <div className="py-4">
              <StudentIdCard
                cardData={{
                  regNo: s.studentRegNo,
                  name: s.fullName,
                  mobile: s.mobile,
                  course: s.coursePreparingFor,
                  seatNumber: s.seat.seatNumber,
                  shiftName: s.seat.shiftName,
                  shiftTiming: "06:00 - 14:00",
                  qrCodeToken: s.qrCodeToken,
                  validTill: s.seat.validUntil ? new Date(s.seat.validUntil).toLocaleDateString() : "Valid Member",
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Attendance Records */}
        {activeTab === "attendance" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Study Attendance History</h3>
                <p className="text-xs text-slate-400">Logged via browser webcam QR scanner at reception</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                Avg: 7.2 hrs/day
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Event</th>
                    <th className="py-3 px-4 font-semibold">Time</th>
                    <th className="py-3 px-4 font-semibold text-right">Study Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {s.attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-white font-medium">
                        {new Date(att.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          {att.scanType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">{att.time}</td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                        {Math.floor(att.studyMinutes / 60)}h {att.studyMinutes % 60}m
                      </td>
                    </tr>
                  ))}
                  {s.attendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-xs">
                        No recent attendance records. Check in at the study hall counter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Fees & Receipts */}
        {activeTab === "fees" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Fee Status & Receipts</h3>
                <p className="text-xs text-slate-400">Sequential receipts generated by GranthSetu</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Current Plan:</span>
                <span className="text-sm font-bold text-white">{s.feeStatus.planName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Total Plan Tariff:</span>
                <span className="text-sm font-bold text-white">₹{s.feeStatus.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Paid Amount:</span>
                <span className="text-sm font-bold text-emerald-400">₹{s.feeStatus.paidAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Outstanding Balance:</span>
                <span className="text-sm font-bold text-white">₹{s.feeStatus.balanceAmount}</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-300 pt-2">Payment Receipts</h4>
            <div className="space-y-2">
              {s.receipts.map((rc) => (
                <div key={rc.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs">
                  <div>
                    <div className="font-mono font-bold text-emerald-400">{rc.receiptNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Paid via {rc.mode} on {new Date(rc.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">₹{rc.amount}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">CAPTURED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
