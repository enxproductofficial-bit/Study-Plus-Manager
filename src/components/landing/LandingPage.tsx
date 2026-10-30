"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  Armchair,
  IndianRupee,
  Clock,
  QrCode,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Lock,
  Calendar,
  MessageSquare,
  BarChart3,
  CreditCard,
  Building,
  Check,
  ChevronDown,
  HelpCircle,
  Play,
  FileText,
  UserCheck,
  Send,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { AuthUser } from "../auth/AuthPage";

interface LandingPageProps {
  onOpenAuth: (initialTab?: "LOGIN" | "SIGNUP") => void;
  onOpenApp: () => void;
  currentUser: AuthUser | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenApp,
  currentUser,
}) => {
  // Interactive Seat Map Demo State
  const [selectedShift, setSelectedShift] = useState<string>("Morning");
  const [previewTab, setPreviewTab] = useState<"owner" | "staff" | "student">("owner");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample interactive seat demo
  const demoSeats = [
    { num: "S-01", status: "occupied", user: "Aditya P." },
    { num: "S-02", status: "occupied", user: "Sneha D." },
    { num: "S-03", status: "available", user: null },
    { num: "S-04", status: "available", user: null },
    { num: "S-05", status: "reserved", user: "Rohit J." },
    { num: "S-06", status: "occupied", user: "Pooja S." },
    { num: "S-07", status: "available", user: null },
    { num: "S-08", status: "occupied", user: "Omkar M." },
    { num: "S-09", status: "available", user: null },
    { num: "S-10", status: "available", user: null },
    { num: "S-11", status: "occupied", user: "Tejas P." },
    { num: "S-12", status: "available", user: null },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BANNER                                               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-2 text-center text-xs font-semibold text-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
            New Version 2.0
          </span>
          <span>
            Compliant with UIDAI Aadhaar eKYC regulations & Razorpay instant settlement integration.
          </span>
          <button
            onClick={() => onOpenAuth("SIGNUP")}
            className="hidden sm:inline-flex items-center underline hover:text-emerald-100 ml-1 font-bold"
          >
            Claim 14-Day Free Trial →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVBAR                                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900">
                GranthSetu
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                Abhyasika Management System
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-emerald-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#modules" className="hover:text-emerald-600 transition-colors">Modules</a>
            <a href="#seat-management" className="hover:text-emerald-600 transition-colors">Live Seat Map</a>
            <a href="#preview" className="hover:text-emerald-600 transition-colors">Dashboards</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Security</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
          </nav>

          {/* Right CTA Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={onOpenApp}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("LOGIN")}
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("SIGNUP")}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all hover:shadow-lg"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Soft emerald / teal background aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-transparent -z-10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Next-Gen Study Centre OS for Maharashtra & India</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                Manage Your Study Centre Smarter with{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  GranthSetu
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                One powerful platform to manage student admissions, seat reservations, fees, attendance, payments and daily operations – all in one place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth("SIGNUP")}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#features"
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <span>Explore Features</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>UIDAI Safe (Aadhaar last 4)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Razorpay Instant Settlement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Dual WhatsApp & SMS Alerts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Dashboard Preview Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-sm">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 font-mono text-[10px] font-bold text-slate-400">
                      app.granthsetu.in/live
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Live Cloud Sync
                  </span>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Total Students</span>
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mt-1">248</p>
                    <span className="text-[9px] font-bold text-emerald-600">+12% this month</span>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Occupied Seats</span>
                      <Armchair className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mt-1">192 <span className="text-xs font-normal text-slate-400">/ 220</span></p>
                    <span className="text-[9px] font-bold text-emerald-700">87% Occupancy</span>
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Today&apos;s Revenue</span>
                      <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mt-1">₹3,28,500</p>
                    <span className="text-[9px] font-bold text-emerald-600">+18% growth</span>
                  </div>

                  <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Pending Fees</span>
                      <Clock className="h-3.5 w-3.5 text-rose-500" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mt-1">₹76,200</p>
                    <span className="text-[9px] font-bold text-rose-600">42 Defaulters</span>
                  </div>
                </div>

                {/* Mini Seat Matrix Preview */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                    <span>Live Floor Map (48 Desks)</span>
                    <span className="text-emerald-600">Morning Shift</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {demoSeats.map((s, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center justify-center rounded-lg py-1 text-[9px] font-mono font-bold border ${
                          s.status === "occupied"
                            ? "bg-rose-500 border-rose-600 text-white"
                            : s.status === "reserved"
                            ? "bg-amber-400 border-amber-500 text-amber-950"
                            : "bg-emerald-50 border-emerald-300 text-emerald-800"
                        }`}
                      >
                        {s.num}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[9px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Occupied</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Reserved</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-slate-900 p-3 text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-900 font-bold">
                    ✓
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold">Counter QR Scan In</p>
                    <p className="text-[9px] text-slate-400">Study hours logged automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROBLEM STATEMENT SECTION                                             */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Why Traditional Methods Fail
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Managing a Study Centre Shouldn&apos;t Be Complicated
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Most Abhyasikas struggle with paper registers, lost fee records, double-booked desks, and disputed renewals. GranthSetu replaces the chaos with effortless digital automation.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {/* Problem 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4 font-bold">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Manual Student Registers</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Pages tear, ink fades, and student KYC contact details are frequently lost. GranthSetu stores verified student profiles permanently with UIDAI safe Aadhaar last-4 storage.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4 font-bold">
                <Armchair className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Difficult Seat Management</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Allocating the same desk to morning and 24-hour members leads to arguments. GranthSetu enforces a strict database constraint preventing double booking.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
                <IndianRupee className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fee Collection Tracking</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Staff forgets who paid cash or UPI, and pending balances slip away. GranthSetu auto-calculates dues, provides payment links, and generates instant PDF receipts.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-4 font-bold">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Missed Renewal Dates</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Chasing students for expired fees is awkward. GranthSetu sends automated simultaneous dual alerts to both the student and their parent on WhatsApp and SMS.
              </p>
            </div>

            {/* Problem 5 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4 font-bold">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Attendance Headaches</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Sign-in sheets are forged and proxy entries are rampant. Students scan their custom QR ID card at the front desk webcam, recording exact check-in and study hours.
              </p>
            </div>

            {/* Problem 6 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4 font-bold">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scattered Spreadsheets</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Owners cannot see true daily profit, rent, electricity expenses, or multi-branch revenue. GranthSetu provides a dedicated, staff-walled Owner Financial Ledger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CORE FEATURES SECTION (12 MODULES)                                     */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Complete Management Capabilities
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            12 Essential Modules Built for Abhyasika Owners
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Everything your study centre needs from day one, strictly compliant with the official Enterprenex SRS v2.0 specifications.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-left">
            {/* 1 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">1. Student Admissions</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Digital KYC form capturing student info, exam target, guardian details, and Aadhaar OTP verification.
              </p>
            </div>

            {/* 2 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Armchair className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">2. Live Seat Reservation</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Interactive floor map displaying vacant, booked, and reserved desks across 4 dynamic shifts without double booking.
              </p>
            </div>

            {/* 3 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <IndianRupee className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">3. Fee Management</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Auto-calculate plan dues, record partial payments, track defaulters, and generate 80G/GST compliant PDF receipts.
              </p>
            </div>

            {/* 4 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">4. QR Attendance</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Instant counter camera check-in and check-out tracking daily study hours and alerting parents of entry/exit.
              </p>
            </div>

            {/* 5 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">5. Digital ID Cards</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Instant printable CR80 PVC ID cards with student photo, study shift, emergency contact, and unique QR code.
              </p>
            </div>

            {/* 6 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">6. Razorpay Gateway</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Accept UPI (PhonePe, GPay, Paytm) and net banking with automated webhook reconciliation into the student fee ledger.
              </p>
            </div>

            {/* 7 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">7. Owner Dashboard</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Full bird&apos;s-eye visibility of real-time revenue, occupancy rate, staff collections, and upcoming fee renewals.
              </p>
            </div>

            {/* 8 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">8. Staff Management</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Role-based access control with staff revenue wall: staff cannot view owner profits, ledger, or other staff activity.
              </p>
            </div>

            {/* 9 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">9. WhatsApp & SMS Alerts</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Simultaneous dual alerts dispatched to both student and parent for admission, fee due dates, and payment receipts.
              </p>
            </div>

            {/* 10 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">10. Income & Expense Ledger</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Track centre rent, electricity, Wi-Fi, cleaning, and staff salaries to calculate net centre-level Profit & Loss.
              </p>
            </div>

            {/* 11 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">11. Analytics & Reports</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Daily sales snapshots, seat yield per plan, shift occupancy charts, and study-hour logs exportable to Excel and PDF.
              </p>
            </div>

            {/* 12 */}
            <div className="rounded-2xl border border-slate-200/70 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-900">12. Multi-Branch Ready</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Seamlessly add multiple reading centres across the city within a single unified owner login and switch branches in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LIVE SEAT MANAGEMENT DEMO SECTION                                     */}
      {/* ========================================================================= */}
      <section id="seat-management" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Interactive Room / Seat Grid
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Zero Double-Booking Seat Reservation
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              GranthSetu allocates seats shift-wise (Morning, Afternoon, Evening, and 24-Hour). The database engine strictly prevents assigning the same desk to overlapping shifts.
            </p>

            {/* Shift Filter Buttons */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200">
              {["Morning", "Afternoon", "Evening", "24 Hours"].map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    selectedShift === shift
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {shift} {shift === "24 Hours" ? "Full Access" : "Shift"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Seat Matrix Preview Box */}
          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Floor Layout — Ground Floor Quiet Zone (AC)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Currently showing live occupancy for: <b className="text-emerald-700">{selectedShift} Shift</b>
                </p>
              </div>

              {/* Status Legends */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-emerald-500" />
                  <span>Available (Green)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-rose-500" />
                  <span>Occupied (Red)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-amber-400" />
                  <span>Reserved (Yellow)</span>
                </div>
              </div>
            </div>

            {/* 12-Seat Demo Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
              {demoSeats.map((seat, idx) => {
                let badgeClass = "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100";
                if (seat.status === "occupied") {
                  badgeClass = "bg-rose-500 border-rose-600 text-white shadow-xs";
                } else if (seat.status === "reserved") {
                  badgeClass = "bg-amber-400 border-amber-500 text-amber-950";
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${badgeClass}`}
                  >
                    <Armchair className="h-5 w-5 mb-1" />
                    <span className="font-mono font-bold text-xs">{seat.num}</span>
                    <span className="text-[9px] mt-0.5 opacity-90 truncate max-w-full">
                      {seat.user || "Vacant"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Info Footer */}
            <div className="mt-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <b>Overlapping Shift Lock Active:</b> Seats assigned to 24-Hour members are automatically locked from Morning and Evening allotments.
                </span>
              </div>
              <button
                onClick={() => onOpenAuth("LOGIN")}
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 whitespace-nowrap"
              >
                Launch Live Matrix →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DASHBOARD PREVIEW SECTION (OWNER, STAFF & STUDENT)                    */}
      {/* ========================================================================= */}
      <section id="preview" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Role-Based Experience
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Dedicated Interfaces for Every Role
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              GranthSetu enforces strict RBAC separation so staff can manage desks and attendance without seeing owner-level financial ledgers.
            </p>

            {/* Role Tab Switcher */}
            <div className="mt-8 inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
              <button
                onClick={() => setPreviewTab("owner")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "owner"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                👑 Owner Dashboard
              </button>
              <button
                onClick={() => setPreviewTab("staff")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "staff"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🧑‍💼 Staff Operations
              </button>
              <button
                onClick={() => setPreviewTab("student")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "student"
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🎓 Student Self-Service Portal
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-900 p-6 sm:p-10 text-white shadow-2xl">
            {previewTab === "owner" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Owner Executive Dashboard</h3>
                    <p className="text-xs text-slate-400">Complete centre analytics, fee collections, profit & loss, and staff audit logs.</p>
                  </div>
                  <span className="rounded-full bg-amber-400/20 text-amber-300 px-3 py-1 text-xs font-bold">
                    Full Access Role
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs text-slate-400">Total Revenue This Month</span>
                    <p className="text-2xl font-black text-white mt-1">₹3,28,500</p>
                    <span className="text-[10px] text-emerald-400 font-bold">+18% vs last month</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs text-slate-400">Occupancy Rate</span>
                    <p className="text-2xl font-black text-white mt-1">87%</p>
                    <span className="text-[10px] text-slate-400">192 / 220 Active Desks</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs text-slate-400">Net Centre Profit</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">₹1,84,200</p>
                    <span className="text-[10px] text-slate-400">After Rent & Salaries</span>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs text-slate-400">Overdue Defaulters</span>
                    <p className="text-2xl font-black text-rose-400 mt-1">42 Students</p>
                    <span className="text-[10px] text-rose-300">₹76,200 Pending</span>
                  </div>
                </div>
              </div>
            )}

            {previewTab === "staff" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Staff Counter Dashboard</h3>
                    <p className="text-xs text-slate-400">Streamlined counter operations: student admission, seat booking, and QR attendance.</p>
                  </div>
                  <span className="rounded-full bg-blue-500/20 text-blue-300 px-3 py-1 text-xs font-bold">
                    Revenue-Walled Staff Role
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <UserPlus className="h-6 w-6 text-blue-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Digital Admission</h4>
                    <p className="text-xs text-slate-400 mt-1">Admit walk-in students, verify OTPs, and print CR80 ID cards in under 2 minutes.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <QrCode className="h-6 w-6 text-purple-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Counter QR Attendance</h4>
                    <p className="text-xs text-slate-400 mt-1">Fast camera scanner automatically marks check-in and logs student study duration.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <Armchair className="h-6 w-6 text-emerald-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Instant Seat Allotment</h4>
                    <p className="text-xs text-slate-400 mt-1">Assign vacant seats or transfer shifts without seeing centre-level financial P&L.</p>
                  </div>
                </div>
              </div>
            )}

            {previewTab === "student" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Student Self-Service Portal</h3>
                    <p className="text-xs text-slate-400">Students log in via mobile OTP to view their allocated desk, attendance logs, and pay dues.</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-bold">
                    Student Member Role
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <Armchair className="h-6 w-6 text-emerald-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Desk S-12 (Morning)</h4>
                    <p className="text-xs text-slate-400 mt-1">View allocated desk, shift hours (06:00 - 14:00), locker status, and renewal validity.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <Clock className="h-6 w-6 text-blue-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Study Hours Tracker</h4>
                    <p className="text-xs text-slate-400 mt-1">Track monthly sitting hours (142 hrs logged this month) to boost competitive study focus.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left">
                    <FileText className="h-6 w-6 text-amber-400 mb-2" />
                    <h4 className="text-sm font-bold text-white">Fee Receipts & Pay UPI</h4>
                    <p className="text-xs text-slate-400 mt-1">One-click online renewal via Razorpay UPI and instant download of GST fee receipts.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HOW IT WORKS (4-STEP WORKFLOW)                                         */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Simple 4-Step Onboarding
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            How GranthSetu Transforms Your Operations
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Get your study centre fully digitized in less than 15 minutes.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {/* Step 1 */}
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Register Your Centre</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Sign up as an Owner, configure your branch name, city, shift timings, and monthly fee tariff plans.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Configure Desks & Staff</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Set up your physical desk grid (S-01 to S-48), locker facilities, and invite front-desk staff accounts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Admit & Print ID Cards</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Record student eKYC, collect initial fees, and issue automatic CR80 PVC ID cards with scannable QR tokens.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-lg mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">Track on Auto-Pilot</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Watch real-time occupancy, automated WhatsApp due reminders, QR check-ins, and net centre profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECURITY & RELIABILITY                                                 */}
      {/* ========================================================================= */}
      <section id="security" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Enterprise-Grade Data Protection
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Built Strictly According to Indian Data Protection Laws
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                GranthSetu adheres to the Digital Personal Data Protection (DPDP) Act 2023 and UIDAI Aadhaar Regulations.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold text-white">UIDAI Aadhaar Compliant</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Only the last 4 digits (e.g. •••• •••• 4821) are stored in the database. Raw 12-digit numbers are never logged or persisted.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <CreditCard className="h-6 w-6 text-blue-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Direct Razorpay Gateway</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Card data never touches our servers. Online payments are reconciled exclusively via verified webhook cryptographic signatures.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <Lock className="h-6 w-6 text-teal-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Role-Based Access Control</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Strict staff revenue wall ensures front-desk operators cannot view owner-level financials, profit ledgers, or business metrics.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <Smartphone className="h-6 w-6 text-purple-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Dual Verification Alerts</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Both Student Mobile and Parent/Guardian Mobile are authenticated to guarantee critical fee and safety notifications are delivered.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <RefreshCw className="h-6 w-6 text-amber-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Automated Cloud Backups</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Continuous PostgreSQL backup with point-in-time recovery on AWS infrastructure to prevent any loss of student fee history.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <FileText className="h-6 w-6 text-rose-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Immutable Financial Audit Logs</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Every fee adjustment, discount, refund, or seat transfer is timestamped with the exact staff member ID and mandatory reason.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. PRICING SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="pricing" className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Simple & Transparent Pricing
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Choose the Right Plan for Your Abhyasika
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            No hidden fees. Free updates. 14-day free trial on all plans.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 text-left">
            {/* Plan 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                Single Branch
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Standard Centre</h3>
              <p className="mt-1 text-xs text-slate-500">For individual study rooms and reading libraries.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">₹999</span>
                <span className="text-xs text-slate-500 ml-1 font-semibold">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 60 physical desks</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Live seat reservation matrix</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> QR Code counter attendance</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Digital PVC ID card generator</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> WhatsApp & SMS alerts</li>
              </ul>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 2: POPULAR */}
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-xl">
              <span className="absolute -top-3.5 right-8 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                Most Popular
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Professional
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Growth Abhyasika</h3>
              <p className="mt-1 text-xs text-slate-500">For growing centres wanting automated fee collection.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">₹1,999</span>
                <span className="text-xs text-slate-500 ml-1 font-semibold">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 200 physical desks</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> All Standard features included</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Razorpay instant UPI integration</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Staff accounts with revenue wall</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Owner financial ledger & P&L</li>
              </ul>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                Get Started with Growth
              </button>
            </div>

            {/* Plan 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                Enterprise
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Multi-Branch Chain</h3>
              <p className="mt-1 text-xs text-slate-500">For abhyasika chains operating across multiple cities.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-slate-900">₹3,499</span>
                <span className="text-xs text-slate-500 ml-1 font-semibold">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Unlimited desks & branches</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Centralized multi-branch reports</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Dedicated account manager</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Custom branding on ID cards</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Priority 24/7 phone support</li>
              </ul>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. CALL TO ACTION (CTA)                                                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Ready to Automate Your Abhyasika?
          </span>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl leading-tight">
            Ready to Manage Your Study Centre Smarter?
          </h2>
          <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto">
            Bring your admissions, seats, fees and attendance together with GranthSetu. Join over 100+ forward-thinking study centres today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuth("SIGNUP")}
              className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              Get Started Today
            </button>
            <button
              onClick={() => onOpenAuth("LOGIN")}
              className="rounded-2xl border border-white/40 bg-white/10 px-6 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              Sign In to Your Centre
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. OFFICIAL ENTERPRENEX SOLUTIONS FOOTER                                 */}
      {/* ========================================================================= */}
      <footer id="contact" className="border-t border-slate-900 bg-[#060a12] text-slate-300 pt-16 pb-12 font-sans select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-slate-800/80">
            {/* Col 1: Enterprenex Solutions Brand & Direct Address (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-amber-500 p-0.5 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0f1d]">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-400 fill-current" aria-hidden="true">
                      <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z" />
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Enterprenex Solutions
                </span>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Empowering businesses with innovative digital solutions and strategic consulting that drive measurable growth.
              </p>

              {/* Contact Direct Details */}
              <div className="space-y-2.5 text-xs text-slate-400 pt-1">
                <a
                  href="mailto:contact@enterprenex.solutions"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>contact@enterprenex.solutions</span>
                </a>

                <a
                  href="tel:+919226860060"
                  className="flex items-center gap-2 hover:text-white transition-colors font-mono"
                >
                  <PhoneCall className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>+91-9226860060</span>
                </a>

                <div className="flex items-start gap-2 pt-1 leading-relaxed">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11.5px]">
                    Plot No. 148, Shrinand Plaza,<br />
                    CIDCO Waluj Mahanagar 1,<br />
                    Chhatrapati Sambhajinagar, MH 431136
                  </span>
                </div>
              </div>

              {/* Social Round Buttons */}
              <div className="flex items-center gap-2.5 pt-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                  title="LinkedIn"
                >
                  in
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold"
                  title="X (Twitter)"
                >
                  𝕏
                </a>
                <a
                  href="https://enterprenex.solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold"
                  title="Official Website"
                >
                  🌐
                </a>
              </div>
            </div>

            {/* Col 2: SERVICES (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                SERVICES
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#contact" className="hover:text-white transition-colors">AI Development</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Mobile App Development</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Backend Development</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">SaaS Development</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Machine Learning</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">DevOps</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Cybersecurity</a></li>
                <li className="pt-1">
                  <a href="#contact" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    View All Services →
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: COMPANY (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                COMPANY
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">All Services</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Verify Credentials</a></li>
                <li>
                  <button onClick={() => onOpenAuth("LOGIN")} className="text-slate-400 hover:text-white transition-colors text-xs">
                    Staff Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: GET IN TOUCH (2 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                GET IN TOUCH
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a
                    href="tel:+919226860060"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Schedule a Free Call
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@enterprenex.solutions"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Send Us an Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919226860060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="pt-1 text-slate-300 font-mono font-bold">
                  Call: <a href="tel:+919226860060" className="text-white hover:underline">+91-9226860060</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Enterprenex Solutions Pvt Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#security" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#security" className="hover:text-slate-400">Terms of Service</a>
              <a href="#security" className="hover:text-slate-400">DPDP Act Compliance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 13. FLOATING ACTION WIDGETS (BOTTOM RIGHT - IDENTICAL TO REFERENCE)      */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* 1. Scroll To Top Button (Blue) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Scroll to Top"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-500 hover:scale-110 transition-all focus:outline-none"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current stroke-2 fill-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* 2. Direct Email Floating Button (Dark Slate) */}
        <a
          href="mailto:contact@enterprenex.solutions"
          title="Send Email to Enterprenex Solutions"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-white shadow-lg hover:bg-slate-800 hover:scale-110 transition-all"
        >
          <Mail className="h-4 w-4" />
        </a>

        {/* 3. Direct WhatsApp Floating Button (Emerald / Green) */}
        <a
          href="https://wa.me/919226860060?text=Hello%20Enterprenex%20Solutions%2C%20I%20want%20to%20inquire%20about%20GranthSetu%20Abhyasika%20Management%20Software."
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp (+91-9226860060)"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 hover:bg-emerald-400 hover:scale-110 transition-all"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.184 1.564 5.938l-1.657 6.056 6.222-1.632c1.704.929 3.655 1.458 5.729 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

