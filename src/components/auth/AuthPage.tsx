"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export interface AuthUser {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  role: "OWNER" | "STAFF" | "STUDENT";
  branchId?: string | null;
  branchName?: string;
  branchCode?: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup Form State
  const [signupRole, setSignupRole] = useState<"OWNER" | "STAFF" | "STUDENT">("OWNER");
  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [centreName, setCentreName] = useState("");
  const [centreCity, setCentreCity] = useState("Chh. Sambhajinagar");
  const [branchCode, setBranchCode] = useState("BR-01");

  // Quick Demo Logins
  const handleDemoLogin = (role: "OWNER" | "STAFF") => {
    if (role === "OWNER") {
      setLoginIdentifier("9876543210");
      setLoginPassword("admin123");
    } else {
      setLoginIdentifier("9876543211");
      setLoginPassword("staff123");
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
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-[#0b132b] to-slate-950 p-4 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Brand Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          {/* Logo & Platform Name */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
              <BookOpen className="h-7 w-7 text-white" />
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
              GranthSetu
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mt-0.5">
              Abhyasika Management System
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Cloud-based administration for study centres, seat reservation & fee collection
            </p>
          </div>

          {/* Tab Switcher: Sign In vs Create Account */}
          <div className="mt-6 flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setTab("LOGIN");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                tab === "LOGIN"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In to Centre
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("SIGNUP");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                tab === "SIGNUP"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              {/* Quick Fill Demo Credentials */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  ⚡ Quick Demo Logins (Click to Auto-fill)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("OWNER")}
                    className="flex flex-col items-start rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-left hover:border-blue-500/50 hover:bg-slate-800/80 transition-all"
                  >
                    <span className="text-xs font-bold text-amber-400">👑 Owner (Full Access)</span>
                    <span className="text-[10px] text-slate-400 font-mono">9876543210</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("STAFF")}
                    className="flex flex-col items-start rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-left hover:border-blue-500/50 hover:bg-slate-800/80 transition-all"
                  >
                    <span className="text-xs font-bold text-blue-400">🧑‍💼 Front-Desk Staff</span>
                    <span className="text-[10px] text-slate-400 font-mono">9876543211</span>
                  </button>
                </div>
              </div>

              {/* Mobile / Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registered Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    required
                    type="text"
                    placeholder="9876543210 or owner@granthsetu.in"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-500">Default: admin123 / staff123</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-10 text-xs font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {tab === "SIGNUP" && (
            <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole("OWNER")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                      signupRole === "OWNER"
                        ? "border-blue-500 bg-blue-600/20 text-white font-bold"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Building2 className="h-4 w-4 mb-1 text-blue-400" />
                    <span className="text-xs">Abhyasika Owner</span>
                    <span className="text-[9px] opacity-75">Creates new centre</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole("STAFF")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                      signupRole === "STAFF"
                        ? "border-blue-500 bg-blue-600/20 text-white font-bold"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <User className="h-4 w-4 mb-1 text-indigo-400" />
                    <span className="text-xs">Front-Desk Staff</span>
                    <span className="text-[9px] opacity-75">Joins with branch code</span>
                  </button>
                </div>
              </div>

              {/* If Owner: Centre Name & City */}
              {signupRole === "OWNER" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-blue-900/30 bg-blue-950/20 p-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Study Centre Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Chanakya Abhyasika"
                      value={centreName}
                      onChange={(e) => setCentreName(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="Chh. Sambhajinagar"
                      value={centreCity}
                      onChange={(e) => setCentreCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* If Staff: Branch Code */}
              {signupRole === "STAFF" && (
                <div className="rounded-xl border border-indigo-900/30 bg-indigo-950/20 p-3">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Enter Branch Code (Ask Owner) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="BR-01"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-xs font-mono font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kulkarni"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    placeholder="9823000000"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-xs font-mono font-bold text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Create Password (Min 6 Characters) *
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account in Neon...
                  </>
                ) : (
                  <>
                    <span>Register & Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Attribution & Support Card */}
          <div className="mt-7 border-t border-slate-800/80 pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>GranthSetu – Abhyasika Management System</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold text-blue-400">
              Powered by ENTERPRENEX SOLUTION PVT LTD
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Headphones className="h-3 w-3" />
              <span>Need Setup Help? Call Enterprenex Support: <b>9226860060</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
