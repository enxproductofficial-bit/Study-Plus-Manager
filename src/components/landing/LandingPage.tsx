"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  FileText,
  UserCheck,
  UserPlus,
  Send,
  RefreshCw,
  Globe,
  Star,
  Search,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { AuthUser } from "../auth/AuthPage";
import { useTranslation, LANGUAGE_OPTIONS, SupportedLanguage } from "@/lib/i18n";

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
  const { lang, setLang } = useTranslation();

  // Interactive Seat Map Demo State
  const [selectedShift, setSelectedShift] = useState<string>("Morning");
  const [previewTab, setPreviewTab] = useState<"owner" | "staff" | "student">("owner");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Dynamic interactive demo seats
  const demoSeats = [
    { num: "S-01", status: "occupied", user: "Aditya P.", shift: "Morning", exam: "MPSC" },
    { num: "S-02", status: "occupied", user: "Sneha D.", shift: "Morning", exam: "UPSC" },
    { num: "S-03", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-04", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-05", status: "reserved", user: "Rohit J.", shift: "24-Hr", exam: "Banking" },
    { num: "S-06", status: "occupied", user: "Pooja S.", shift: "Morning", exam: "NEET" },
    { num: "S-07", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-08", status: "occupied", user: "Omkar M.", shift: "Morning", exam: "MPSC" },
    { num: "S-09", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-10", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-11", status: "occupied", user: "Tejas P.", shift: "Morning", exam: "JEE" },
    { num: "S-12", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-13", status: "occupied", user: "Kavita R.", shift: "Morning", exam: "MPSC" },
    { num: "S-14", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-15", status: "occupied", user: "Sanket B.", shift: "Morning", exam: "SSC" },
    { num: "S-16", status: "reserved", user: "Nikhil K.", shift: "Evening", exam: "Banking" },
    { num: "S-17", status: "available", user: null, shift: "Any", exam: null },
    { num: "S-18", status: "occupied", user: "Aniket W.", shift: "Morning", exam: "UPSC" },
  ];

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === lang) || LANGUAGE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BANNER                                               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-navy-900 via-teal-900/60 to-navy-900 border-b border-teal-500/20 px-4 py-2 text-center text-xs font-semibold text-teal-200">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-400/30 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-teal-300">
            <Sparkles className="h-3 w-3" /> GranthSetu v2.0
          </span>
          <span className="text-slate-300">
            Next-Gen Abhyasika Operating System with Live Shift Lock & Instant WhatsApp Receipts.
          </span>
          <button
            onClick={() => onOpenAuth("SIGNUP")}
            className="inline-flex items-center gap-1 font-bold text-teal-300 hover:text-white underline transition-colors"
          >
            Claim 14-Day Free Trial <ArrowRight className="h-3 w-3 inline" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVBAR (Executive Dark Glass)                                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-navy-900/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  Granth<span className="text-teal-400">Setu</span>
                </span>
                <span className="rounded-md bg-teal-500/15 border border-teal-500/30 px-1.5 py-0.2 text-[9px] font-bold text-teal-300">
                  PRO
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Study Centre Management OS
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">Superpowers</a>
            <a href="#seat-matrix" className="hover:text-teal-400 transition-colors">Live Seat Matrix</a>
            <a href="#modules" className="hover:text-teal-400 transition-colors">12 Modules</a>
            <a href="#preview" className="hover:text-teal-400 transition-colors">Role Portals</a>
            <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-teal-400 transition-colors">Support</a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                title="Select Language"
              >
                <Globe className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-[11px] font-bold">{currentLangObj.nativeName}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                    Select Language ({LANGUAGE_OPTIONS.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setLang(opt.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                          lang === opt.code
                            ? "bg-teal-500/20 text-teal-300 font-bold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <span>{opt.nativeName}</span>
                        <span className="text-[10px] text-slate-400">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Dashboard CTA */}
            {currentUser ? (
              <button
                onClick={onOpenApp}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-cyan-400 transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("LOGIN")}
                  className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </button>
                <Link
                  href="/register-library"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-400 hover:scale-[1.02] transition-all"
                >
                  <span>Register Centre</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (Executive High-Tech Showcase)                            */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        {/* Luminous Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-teal-500/15 via-cyan-500/10 to-transparent -z-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/10 -z-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 left-10 w-96 h-96 bg-teal-600/10 -z-10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left Column: Compelling Sales Pitch */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Next-Gen Operating System for Abhyasikas</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]">
                Manage Your Study Centre Smarter with{" "}
                <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  GranthSetu
                </span>
              </h1>

              {/* High-Impact Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
                The all-in-one platform built for Indian reading rooms. Automate student admissions, live shift-locked seat reservations, UPI fee collection, dual WhatsApp alerts, and owner P&L — with zero double-booking.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/register-library"
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-teal-500/30 hover:from-teal-400 hover:to-cyan-400 transition-all hover:scale-[1.02]"
                >
                  <Building className="h-4 w-4 text-slate-950" />
                  <span>Register Your Centre</span>
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </Link>

                <a
                  href="#seat-matrix"
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 shadow-sm hover:border-teal-500/50 hover:bg-slate-800 transition-all"
                >
                  <span>Explore Live Seat Map</span>
                  <ChevronDown className="h-4 w-4 text-teal-400" />
                </a>
              </div>

              {/* Quick Role Tour Bar */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Explore Connected SaaS Portals:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/owner"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-950/40 px-3 py-1.5 text-[11px] font-bold text-teal-300 hover:bg-teal-900/40 transition"
                  >
                    <Building className="h-3.5 w-3.5 text-teal-400" />
                    Owner Dashboard
                  </Link>
                  <Link
                    href="/staff"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 px-3 py-1.5 text-[11px] font-bold text-blue-300 hover:bg-blue-900/40 transition"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                    Staff Counter
                  </Link>
                  <Link
                    href="/student"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-slate-800 transition"
                  >
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    Student Self-Portal
                  </Link>
                  <Link
                    href="/super-admin"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-900/40 transition"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    Platform Admin
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>UIDAI Aadhaar Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Razorpay Instant UPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Dual WhatsApp Alerts</span>
                </div>
              </div>
            </div>

            {/* Right Column: World-Class macOS Dashboard Window Showcase */}
            <div className="lg:col-span-6 relative">
              
              {/* Outer Glow behind the Dashboard Window */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-600/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />

              {/* Dashboard Window Container */}
              <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-slate-950/80 backdrop-blur-xl overflow-hidden">
                
                {/* macOS Titanium Window Titlebar */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/90 shadow-xs" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/90 shadow-xs" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/90 shadow-xs" />
                    <div className="ml-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 font-mono text-[10px] text-slate-400 border border-slate-800">
                      <Lock className="h-2.5 w-2.5 text-teal-400" />
                      <span>app.granthsetu.in/owner</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                      Live Sync Active
                    </span>
                  </div>
                </div>

                {/* Dashboard Showcase Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* Top Bar inside mockup: Owner Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Shivaji Nagar Campus</span>
                        <span className="text-[10px] text-slate-400 font-normal">| Pune, MH</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">Shift Matrix & Financial Snapshot</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-[10px] font-mono text-teal-300">
                        October 2026
                      </span>
                    </div>
                  </div>

                  {/* 4 Master KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    
                    {/* KPI 1 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400">Total Students</span>
                        <Users className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <p className="text-lg font-black text-white mt-1">248</p>
                      <span className="text-[9px] font-bold text-teal-400">↑ +14% this mo</span>
                    </div>

                    {/* KPI 2 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400">Occupancy</span>
                        <Armchair className="h-3.5 w-3.5 text-teal-400" />
                      </div>
                      <p className="text-lg font-black text-white mt-1">87%</p>
                      <span className="text-[9px] font-bold text-slate-400">192 / 220 seats</span>
                    </div>

                    {/* KPI 3 */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400">Revenue</span>
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <p className="text-lg font-black text-white mt-1">₹3,28,500</p>
                      <span className="text-[9px] font-bold text-emerald-400">Razorpay Settled</span>
                    </div>

                    {/* KPI 4 */}
                    <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-rose-300">Pending Dues</span>
                        <Clock className="h-3.5 w-3.5 text-rose-400" />
                      </div>
                      <p className="text-lg font-black text-rose-200 mt-1">₹76,200</p>
                      <span className="text-[9px] font-bold text-rose-400">42 Defaulters</span>
                    </div>
                  </div>

                  {/* Interactive Mini Seat Matrix Component inside Mockup */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-teal-400" />
                        <span className="text-xs font-bold text-slate-200">AC Hall Floor Map (48 Desks)</span>
                      </div>
                      
                      {/* Shift Switcher inside mock */}
                      <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                        {["Morning", "Afternoon", "Evening", "24-Hr"].map((sh) => (
                          <button
                            key={sh}
                            onClick={() => setSelectedShift(sh)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition ${
                              selectedShift.startsWith(sh.slice(0, 4))
                                ? "bg-teal-500 text-slate-950 font-black shadow-xs"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {sh}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid of 18 demo seats */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {demoSeats.map((s, i) => {
                        let isOccupied = s.status === "occupied";
                        let isReserved = s.status === "reserved";

                        return (
                          <div
                            key={i}
                            className={`flex flex-col items-center justify-center rounded-lg py-1.5 px-1 text-center transition-all border ${
                              isOccupied
                                ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                                : isReserved
                                ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                                : "bg-teal-950/30 border-teal-800/60 text-teal-300 hover:bg-teal-900/40"
                            }`}
                          >
                            <span className="text-[10px] font-mono font-black">{s.num}</span>
                            <span className="text-[8px] opacity-80 truncate max-w-full font-medium">
                              {s.user ? s.user.split(" ")[0] : "Vacant"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Status Legend */}
                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[9px] font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> Vacant
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Booked
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> 24-Hr Lock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Glassmorphic Micro-Badges */}
                <div className="hidden sm:flex absolute -bottom-3 -left-3 items-center gap-2.5 rounded-2xl border border-teal-500/30 bg-slate-950/90 p-2.5 text-xs text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-black">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] font-bold text-white">QR Self-Admission</p>
                    <p className="text-[9px] text-teal-300">Rohit J. (MPSC) • Allotted Desk S-08</p>
                  </div>
                </div>

                <div className="hidden sm:flex absolute -top-3 -right-3 items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-2.5 text-xs text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-[11px] font-bold text-white">WhatsApp Receipt Sent</p>
                    <p className="text-[9px] text-emerald-300">₹1,500 UPI Dispatched Automatically</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SOCIAL PROOF & METRICS STRIP                                          */}
      {/* ========================================================================= */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">50+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Study Centres Digitized</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">15,000+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Active Students</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">₹1.2 Cr+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Fees Collected via UPI</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">99.9%</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Zero Double Booking</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE GRANTHSETU DIFFERENCE: OLD VS NEW                                  */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Why Traditional Methods Fail
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Managing an Abhyasika Shouldn&apos;t Be Painful
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            Most study centres still struggle with paper registers, lost fee records, double-booked desks, and disputed renewals. GranthSetu replaces the chaos with seamless digital precision.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 hover:border-teal-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-4 font-bold border border-rose-500/20">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Paper KYC Registers</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Pages tear, ink fades, and guardian numbers get lost. GranthSetu stores verified student profiles permanently with UIDAI safe Aadhaar storage.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 hover:border-teal-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-4 font-bold border border-amber-500/20">
                <Armchair className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Seat Double-Booking</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Allocating the same desk to morning and 24-hour members leads to daily disputes. GranthSetu enforces strict database constraints preventing overlap.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 hover:border-teal-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4 font-bold border border-blue-500/20">
                <IndianRupee className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Lost Fee Tracking</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Staff forgets who paid cash vs UPI, and pending balances slip away. GranthSetu auto-calculates dues and generates instant GST-compliant PDF receipts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 hover:border-teal-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 mb-4 font-bold border border-teal-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Manual WhatsApp Chasing</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Chasing students for expired fees is awkward. GranthSetu sends automated simultaneous alerts to both student and parent on WhatsApp and SMS.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BENTO GRID OF CORE SUPERPOWERS (6 Pillars)                             */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Modern Enterprise Architecture
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              6 Built-In Superpowers for Abhyasika Owners
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Engineered strictly for study rooms, library halls, and competitive exam abhyasikas.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                <Armchair className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">1. Live Shift-Locked Seat Map</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualize floor occupancy in real-time across Morning, Afternoon, Evening, and 24-Hour shifts. The database engine strictly rejects overlapping double-allotments.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span>Shift overlap protection</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">2. Entrance QR Self-Admission</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Place a QR standee at your study centre door. Walk-in students scan with their phone, submit their details & course, and land directly in your Owner Approval Queue.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <span>1-Click Accept & Allot Desk</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <IndianRupee className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">3. GST Fee Receipts & WhatsApp</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Generate professional fee receipts with auto-generated receipt serial numbers (`RCP-2026-XXXX`). 1-click Download PDF, Print, or dispatch directly on WhatsApp.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span>Instant wa.me link generation</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">4. Dual WhatsApp & SMS Hub</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Keep parents informed. GranthSetu triggers automated notifications to both the student and their parent upon admission, fee due dates, and monthly fee renewals.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-400">
                <span>Dual Guardian Authentication</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">5. Confidential Owner P&L Ledger</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Record study centre rent, electricity, Wi-Fi, and staff salaries. A strict staff revenue wall ensures front-desk counter staff cannot see owner net profits.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-purple-400">
                <span>Role-Based Financial Wall</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Pillar 6 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 hover:border-teal-500/50 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">6. 10 Indian Regional Languages</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                GranthSetu adapts to your staff and students in Marathi, Hindi, Telugu, English, Tamil, Kannada, Malayalam, Bengali, Gujarati, and Punjabi with 1-click switching.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span>Multi-Lingual i18n Engine</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE LIVE SEAT MATRIX PLAYGROUND                                */}
      {/* ========================================================================= */}
      <section id="seat-matrix" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Interactive Room / Seat Grid
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Zero Double-Booking Seat Reservation
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              GranthSetu allocates seats shift-wise (Morning, Afternoon, Evening, and 24-Hour). The database engine strictly prevents assigning the same desk to overlapping shifts.
            </p>

            {/* Shift Filter Buttons */}
            <div className="mt-8 inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
              {["Morning", "Afternoon", "Evening", "24 Hours"].map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    selectedShift === shift
                      ? "bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {shift} {shift === "24 Hours" ? "Full Access" : "Shift"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Seat Matrix Preview Box */}
          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-base text-white">
                  Ground Floor Quiet Zone (Air Conditioned)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currently showing live occupancy for: <b className="text-teal-400">{selectedShift} Shift</b>
                </p>
              </div>

              {/* Status Legends */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-teal-500" />
                  <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-rose-500" />
                  <span className="text-slate-300">Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-amber-400" />
                  <span className="text-slate-300">Reserved / 24-Hr</span>
                </div>
              </div>
            </div>

            {/* 18-Seat Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
              {demoSeats.map((seat, idx) => {
                let badgeClass = "bg-teal-950/30 border-teal-800/60 text-teal-300 hover:bg-teal-900/40";
                if (seat.status === "occupied") {
                  badgeClass = "bg-rose-950/40 border-rose-800/60 text-rose-300";
                } else if (seat.status === "reserved") {
                  badgeClass = "bg-amber-950/40 border-amber-800/60 text-amber-300";
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${badgeClass}`}
                  >
                    <Armchair className="h-5 w-5 mb-1" />
                    <span className="font-mono font-bold text-xs">{seat.num}</span>
                    <span className="text-[10px] mt-0.5 opacity-90 truncate max-w-full">
                      {seat.user || "Vacant"}
                    </span>
                    {seat.exam && (
                      <span className="text-[8px] font-bold text-slate-400 mt-0.5">
                        {seat.exam}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info Footer */}
            <div className="mt-6 rounded-2xl bg-teal-950/40 border border-teal-500/30 p-4 text-xs text-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span>
                  <b>Overlapping Shift Lock Active:</b> Seats assigned to 24-Hour members are automatically locked from Morning and Evening allotments.
                </span>
              </div>
              <button
                onClick={() => onOpenAuth("LOGIN")}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-teal-400 transition whitespace-nowrap"
              >
                Launch Live Matrix →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. 12 ESSENTIAL MODULES                                                  */}
      {/* ========================================================================= */}
      <section id="modules" className="py-20 border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Complete Operations Suite
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            12 Essential Modules Built for Abhyasika Owners
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            Everything your study centre needs from day one, compliant with official Enterprenex SRS v2.0 specifications.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-left">
            {[
              {
                icon: UserCheck,
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
                title: "1. Student Admissions",
                desc: "Digital KYC form capturing student details, target competitive exam, guardian mobile, and Aadhaar OTP verification.",
              },
              {
                icon: Armchair,
                color: "text-teal-400",
                bg: "bg-teal-500/10 border-teal-500/20",
                title: "2. Live Seat Reservation",
                desc: "Interactive floor map displaying vacant, booked, and reserved desks across 4 dynamic shifts without double booking.",
              },
              {
                icon: IndianRupee,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
                title: "3. Fee Management",
                desc: "Auto-calculate plan dues, record partial payments, track defaulters, and generate GST-compliant PDF receipts.",
              },
              {
                icon: QrCode,
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                title: "4. Entrance QR Self-Admission",
                desc: "Walk-in students scan QR standee at entrance, submit KYC on their phone, and wait in owner acceptance queue.",
              },
              {
                icon: FileText,
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
                title: "5. Digital PVC ID Cards",
                desc: "Instant printable CR80 PVC ID cards with student photo, study shift, emergency contact, and unique QR code.",
              },
              {
                icon: CreditCard,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10 border-cyan-500/20",
                title: "6. Razorpay Gateway",
                desc: "Accept UPI (PhonePe, GPay, Paytm) and net banking with automated webhook reconciliation into the student fee ledger.",
              },
              {
                icon: BarChart3,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10 border-indigo-500/20",
                title: "7. Owner Executive Portal",
                desc: "Full bird's-eye visibility of real-time revenue, occupancy rate, staff collections, and upcoming fee renewals.",
              },
              {
                icon: ShieldCheck,
                color: "text-teal-400",
                bg: "bg-teal-500/10 border-teal-500/20",
                title: "8. Staff Management",
                desc: "Role-based access control with staff revenue wall: staff cannot view owner profits, ledger, or other staff activity.",
              },
              {
                icon: Smartphone,
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
                title: "9. Dual WhatsApp Alerts",
                desc: "Simultaneous dual alerts dispatched to both student and parent for admission, fee due dates, and payment receipts.",
              },
              {
                icon: FileSpreadsheet,
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
                title: "10. Income & Expense P&L",
                desc: "Track centre rent, electricity, Wi-Fi, cleaning, and staff salaries to calculate net centre-level Profit & Loss.",
              },
              {
                icon: TrendingUp,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
                title: "11. Analytics & Reports",
                desc: "Daily sales snapshots, seat yield per plan, shift occupancy charts, and study-hour logs exportable to Excel and PDF.",
              },
              {
                icon: Building,
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                title: "12. Multi-Branch Ready",
                desc: "Seamlessly add multiple reading centres across the city within a single unified owner login and switch branches in 1 click.",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 hover:border-teal-500/40 hover:bg-slate-900 transition-all group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${m.bg} ${m.color} group-hover:scale-110 transition-transform`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3.5 text-sm font-bold text-white">{m.title}</h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. ROLE PREVIEW SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="preview" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Role-Based Architecture
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Dedicated Interfaces for Every Role
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              GranthSetu enforces strict RBAC separation so staff can manage desks and admissions without seeing owner-level financial ledgers.
            </p>

            {/* Role Tab Switcher */}
            <div className="mt-8 inline-flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
              <button
                onClick={() => setPreviewTab("owner")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "owner"
                    ? "bg-teal-500 text-slate-950 font-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                👑 Owner Dashboard
              </button>
              <button
                onClick={() => setPreviewTab("staff")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "staff"
                    ? "bg-teal-500 text-slate-950 font-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🧑‍💼 Staff Operations
              </button>
              <button
                onClick={() => setPreviewTab("student")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  previewTab === "student"
                    ? "bg-teal-500 text-slate-950 font-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎓 Student Self-Portal
              </button>
            </div>
          </div>

          {/* Role Preview Card */}
          <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 text-white shadow-2xl backdrop-blur-xl">
            {previewTab === "owner" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Owner Executive Dashboard</h3>
                    <p className="text-xs text-slate-400">Complete centre analytics, fee collections, profit & loss, and staff audit logs.</p>
                  </div>
                  <span className="rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 text-xs font-bold">
                    Executive Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs text-slate-400">Total Monthly Revenue</span>
                    <p className="text-2xl font-black text-white mt-1">₹3,28,500</p>
                    <span className="text-[10px] text-teal-400 font-bold">+18% growth</span>
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
                  <span className="rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 text-xs font-bold">
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
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-bold">
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
      {/* 10. TESTIMONIALS FROM MAHARASHTRA STUDY CENTRES                           */}
      {/* ========================================================================= */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Verified Study Centres
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Trusted by 50+ Abhyasika Owners
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Hear directly from study centre directors across Pune, Chhatrapati Sambhajinagar, and Maharashtra.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Testimonial 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;GranthSetu completely eliminated our desk double-booking headaches. The shift overlap engine ensures 24-hour students and morning students never conflict. Our fee collection jumped by 25% with automated WhatsApp receipts!&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 font-bold">
                  SD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sanjay Deshmukh</h4>
                  <p className="text-[10px] text-slate-400">Director, Saraswati Abhyasika, Pune</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;The QR Self-Admission standee is a game changer! Walk-in UPSC aspirants scan the QR at our front entrance, submit their KYC, and I simply 1-click approve them from my phone. No more messy paper registers.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  VP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vijay Patil</h4>
                  <p className="text-[10px] text-slate-400">Founder, Chhatrapati Study Centre, Sambhajinagar</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;The confidential Owner P&L sheet keeps my net profits and expenses hidden from counter staff. Meanwhile, parents love the automated WhatsApp alerts when fees are due. GranthSetu is worth every rupee.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rajesh Kulkarni</h4>
                  <p className="text-[10px] text-slate-400">Owner, Sankalp Reading Hall, Latur</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. PRICING SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Simple & Transparent Pricing
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Choose the Right Plan for Your Abhyasika
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
            No hidden setup fees. Free updates included. 14-day free trial on all plans.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 text-left">
            
            {/* Plan 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                  Single Branch
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Standard Centre</h3>
                <p className="mt-1 text-xs text-slate-400">For individual reading rooms and study halls.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹999</span>
                  <span className="text-xs text-slate-400 ml-1 font-semibold">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Up to 60 physical desks</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Live seat reservation matrix</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Entrance QR self-admission</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Digital PVC ID card generator</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> WhatsApp & SMS alerts</li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl border border-slate-700 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 2: POPULAR */}
            <div className="relative rounded-3xl border-2 border-teal-500 bg-slate-900 p-8 shadow-2xl shadow-teal-500/10 flex flex-col justify-between">
              <span className="absolute -top-3.5 right-8 rounded-full bg-teal-500 px-3 py-1 text-[11px] font-black text-slate-950 shadow-sm">
                Most Popular
              </span>
              <div>
                <span className="rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 text-xs font-bold">
                  Professional Growth
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Growth Abhyasika</h3>
                <p className="mt-1 text-xs text-slate-400">For ambitious centres wanting full fee & shift automation.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹1,999</span>
                  <span className="text-xs text-slate-400 ml-1 font-semibold">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Up to 200 physical desks</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> All Standard features included</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Razorpay instant UPI integration</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Staff accounts with revenue wall</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Owner financial ledger & P&L</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Multi-lingual 10-language suite</li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-400 transition-all hover:scale-[1.02]"
              >
                Get Started with Growth
              </button>
            </div>

            {/* Plan 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                  Enterprise
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">Multi-Branch Chain</h3>
                <p className="mt-1 text-xs text-slate-400">For abhyasika chains operating across multiple cities.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black text-white">₹3,499</span>
                  <span className="text-xs text-slate-400 ml-1 font-semibold">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Unlimited desks & branches</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Centralized multi-branch reports</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Dedicated account manager</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Custom branding on ID cards</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-400" /> Priority 24/7 phone support</li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth("SIGNUP")}
                className="mt-8 w-full rounded-xl border border-slate-700 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all"
              >
                Contact Enterprise Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FAQ ACCORDION                                                         */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Got Questions?
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Everything you need to know about setting up GranthSetu for your study room.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the Entrance QR Self-Admission work without Google Forms?",
                a: "GranthSetu provides a dedicated, native web admission form located inside your own software at /admission/self. You simply download and print the auto-generated QR Standee and place it at your front desk. When walk-in students scan the QR code with their mobile phone, they fill their KYC and exam details directly into GranthSetu. Their request lands in your Owner Dashboard's Acceptance Queue where you can 1-click approve them and allot a desk.",
              },
              {
                q: "How does the system prevent double booking seats across shifts?",
                a: "GranthSetu uses a database-level conflict lock. When a seat (e.g. S-05) is allocated to a 24-Hour full-access student, that desk is immediately locked and unavailable for Morning, Afternoon, or Evening shift allocations. If two counter staff attempt to allot the same desk at the same time, the server rejects the duplicate allotment with an immediate conflict warning.",
              },
              {
                q: "Can my counter staff see how much net profit my study centre makes?",
                a: "No. GranthSetu has a strict Staff Revenue Wall. Front-desk staff only see counter tools (student admissions, seat map, ID card printing, and checking students in). They cannot view owner profits, centre rent, electricity expenses, or overall business P&L.",
              },
              {
                q: "Does GranthSetu work on mobile phones and tablets?",
                a: "Yes! GranthSetu is fully responsive and optimized for mobile phones, tablets, laptops, and desktop computers. You can manage your entire study centre, approve admissions, and review fee collections from your smartphone anywhere in the world.",
              },
              {
                q: "How are fee receipts delivered to students and parents?",
                a: "Whenever a payment is recorded (via cash or Razorpay UPI), GranthSetu generates a formal, numbered fee receipt (RCP-2026-XXXX). You can download it as a PDF, print it directly, or click 1 button to send it directly to the student and parent via WhatsApp using wa.me.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-teal-300 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-teal-400 transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. HIGH-IMPACT FINAL CTA                                                */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-teal-950/60 to-navy-900 border-t border-teal-500/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 px-3 py-1 text-xs font-bold text-teal-300 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Ready to Upgrade Your Study Centre?
          </span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
            Stop Managing on Paper. <br />
            Run Your Abhyasika on Autopilot.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Join 50+ leading study rooms across Maharashtra. Get started in less than 15 minutes with our 14-day free trial.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register-library"
              className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-teal-500/30 hover:from-teal-400 hover:to-cyan-400 transition-all hover:scale-105"
            >
              Register Your Centre (Free Trial)
            </Link>
            <button
              onClick={() => onOpenAuth("LOGIN")}
              className="rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. OFFICIAL ENTERPRENEX SOLUTIONS FOOTER                                 */}
      {/* ========================================================================= */}
      <footer id="contact" className="border-t border-slate-900 bg-[#060a12] text-slate-300 pt-16 pb-12 font-sans select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-slate-800/80">
            
            {/* Col 1: Enterprenex Solutions Brand & Direct Address (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
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

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Empowering businesses with innovative digital solutions and strategic consulting that drive measurable growth.
              </p>

              {/* Direct Details */}
              <div className="space-y-2.5 text-xs text-slate-400 pt-1">
                <a
                  href="mailto:contact@enterprenex.solutions"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>contact@enterprenex.solutions</span>
                </a>

                <a
                  href="tel:+919226860060"
                  className="flex items-center gap-2 hover:text-white transition-colors font-mono"
                >
                  <PhoneCall className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>+91-9226860060</span>
                </a>

                <div className="flex items-start gap-2 pt-1 leading-relaxed">
                  <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-teal-600 hover:text-white transition-all text-xs font-bold"
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
                  <a href="#contact" className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1">
                    Explore All Services <ArrowRight className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: INDUSTRIES (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                INDUSTRIES
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Education & EdTech</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Healthcare</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">FinTech</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Logistics & Supply Chain</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Retail & E-commerce</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Real Estate</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Hospitality</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Manufacturing</a></li>
              </ul>
            </div>

            {/* Col 4: QUICK LINKS (2 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                QUICK LINKS
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features & Superpowers</a></li>
                <li><a href="#seat-matrix" className="hover:text-white transition-colors">Live Seat Matrix</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
                <li><Link href="/admission/self" className="hover:text-white transition-colors">QR Self-Admission Form</Link></li>
                <li><Link href="/register-library" className="hover:text-white transition-colors">Register Study Centre</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Enterprenex Solutions Pvt. Ltd. All rights reserved. GranthSetu Abhyasika Management System.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <a href="#contact" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#contact" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#contact" className="hover:text-slate-400 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
