"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Lock,
  Phone,
  User,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Headphones,
  Mail,
  MapPin,
  QrCode,
  CreditCard,
  Layers,
  ArrowLeft,
  Users,
} from "lucide-react";

export interface AuthUser {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  role: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
  branchId?: string | null;
  branchName?: string;
  branchCode?: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToLanding?: () => void;
  initialTab?: "LOGIN" | "SIGNUP";
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  initialTab = "LOGIN",
}) => {
  const [tab, setTab] = useState<"LOGIN" | "SIGNUP">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("9876543210");
  const [loginPassword, setLoginPassword] = useState("admin123");

  // Signup Form State
  const [signupRole, setSignupRole] = useState<"OWNER" | "STAFF" | "STUDENT">("OWNER");
  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [centreName, setCentreName] = useState("");
  const [centreCity, setCentreCity] = useState("Pune");
  const [branchCode, setBranchCode] = useState("BR-01");

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Quick Demo Logins
  const handleDemoSelect = (role: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT") => {
    setError(null);
    if (role === "SUPER_ADMIN") {
      setLoginIdentifier("9226860060");
      setLoginPassword("admin123");
    } else if (role === "OWNER") {
      setLoginIdentifier("9876543210");
      setLoginPassword("admin123");
    } else if (role === "STAFF") {
      setLoginIdentifier("9876543211");
      setLoginPassword("staff123");
    } else {
      setLoginIdentifier("9226860060");
      setLoginPassword("student123");
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save user to localStorage
      localStorage.setItem("granthsetu_user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          mobile: signupMobile,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
          centreName: signupRole === "OWNER" ? centreName : undefined,
          city: signupRole === "OWNER" ? centreCity : undefined,
          branchCode: signupRole === "STAFF" ? branchCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Account creation failed");
      }

      setSuccessMsg(data.message || "Account created successfully!");
      localStorage.setItem("granthsetu_user", JSON.stringify(data.user));
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT SECTION: Dark Navy / Purple Hero Branding                           */}
      {/* ========================================================================= */}
      <div className="relative lg:w-5/12 xl:w-1/2 bg-[#0c192e] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Branding */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <BookOpen className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">GranthSetu</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Abhyasika Management System
                </span>
              </div>
            </Link>

            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Website
              </button>
            )}
          </div>

          <div className="mt-12 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Next-Generation Study Centre Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Manage Your Study Centre with Intelligence & Ease
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              A comprehensive cloud platform tailored for reading halls, study centres, and libraries across Maharashtra and India. Replace manual registers with automated seat matrix, fee collection, and digital student admission.
            </p>
          </div>

          {/* Key Feature Highlights */}
          <div className="mt-8 space-y-3.5 max-w-lg">
            {[
              { label: "Live Interactive 48-Seat Map with double-booking prevention", icon: Layers },
              { label: "UIDAI Aadhaar eKYC with last-4-digits-only data retention", icon: ShieldCheck },
              { label: "Company Razorpay webhook reconciliation & sequential receipts", icon: CreditCard },
              { label: "Simultaneous dual WhatsApp & SMS notifications to Student & Parent", icon: Phone },
              { label: "Front-desk webcam QR attendance with daily study-hour logs", icon: QrCode },
              { label: "Owner-only financial P&L ledger with staff revenue wall (FR-ST-3)", icon: Building2 },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-300">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Icon className="h-3 w-3" />
                  </div>
                  <span>{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Attribution & Support Card */}
        <div className="relative z-10 pt-10 mt-10 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">Enterprenex Solution Pvt. Ltd.</p>
              <p className="text-[11px] text-slate-400">CIDCO Waluj Mahanagar 1, Chhatrapati Sambhajinagar</p>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-indigo-400" />
              <a href="tel:+919226860060" className="font-mono text-xs font-bold text-indigo-400 hover:underline">
                +91-9226860060
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: Clean White Form with Demo Quick-Select                    */}
      {/* ========================================================================= */}
      <div className="lg:w-7/12 xl:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          {/* Form Card Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {tab === "LOGIN" ? "Sign in to GranthSetu" : "Register Study Centre"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {tab === "LOGIN"
                ? "Enter your credentials or choose a quick demonstration role below."
                : "Create a new library owner account to manage your desks and students."}
            </p>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-2">
              Select Demo Login Role:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect("SUPER_ADMIN")}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  loginIdentifier === "9226860060" && loginPassword === "admin123"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Super Admin
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("OWNER")}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  loginIdentifier === "9876543210"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                Owner
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("STAFF")}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  loginIdentifier === "9876543211"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <User className="h-3.5 w-3.5 text-blue-500" />
                Staff Desk
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect("STUDENT")}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  loginPassword === "student123"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Users className="h-3.5 w-3.5 text-purple-500" />
                Student
              </button>
            </div>
          </div>

          {/* Form Tabs: Sign In vs Create Account */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTab("LOGIN");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                tab === "LOGIN"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("SIGNUP");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                tab === "SIGNUP"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {tab === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Mobile Number / Email / Username
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or owner@granthsetu.in"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to GranthSetu"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {tab === "SIGNUP" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">I am registering as:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setSignupRole("OWNER")}
                    className={`rounded-xl py-2 text-xs font-bold transition border ${
                      signupRole === "OWNER"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Library Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole("STAFF")}
                    className={`rounded-xl py-2 text-xs font-bold transition border ${
                      signupRole === "STAFF"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Staff Member
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {signupRole === "OWNER" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Study Centre Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. StudyPlus Abhyasika"
                      value={centreName}
                      onChange={(e) => setCentreName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">City</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={centreCity}
                      onChange={(e) => setCentreCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700">Branch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BR-01"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700">Create Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Registration"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Quick Setup Wizard Redirect */}
          <div className="mt-8 text-center border-t border-slate-200 pt-5">
            <span className="text-xs text-slate-500">Need a guided setup for your library?</span>{" "}
            <Link
              href="/register-library"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
            >
              Open Setup Wizard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered mobile number to receive an instant verification link.
            </p>

            {!forgotSent ? (
              <div className="mt-4 space-y-3">
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile"
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    Send OTP
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center space-y-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  Password reset OTP dispatched via SMS & WhatsApp to your registered number.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
