"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  CreditCard,
} from "lucide-react";

export default function RegisterLibraryPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successResult, setSuccessResult] = useState<any>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    password: "",
    libraryName: "",
    tagline: "Study • Focus • Grow",
    address: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    totalSeats: 48,
    branchesCount: 1,
    otpCode: "4289", // Simulation OTP
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.ownerName || !formData.ownerMobile || !formData.password) {
        setErrorMsg("Please enter owner name, mobile number, and password.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.libraryName || !formData.city) {
        setErrorMsg("Please enter library name and city.");
        return;
      }
      setStep(3); // OTP Step
    }
  };

  // Submit Registration & Provision Workspace
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/libraries/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      // Store authenticated session
      localStorage.setItem("granthsetu_user", JSON.stringify(data.user));
      setSuccessResult(data);
      setStep(4); // Success step
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white">GranthSetu</span>
              <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Abhyasika Management System
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Website
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="mx-auto max-w-xl w-full px-4 py-10 flex-1 flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[
            { num: 1, label: "Owner Info" },
            { num: 2, label: "Study Centre" },
            { num: 3, label: "Verification" },
            { num: 4, label: "Activated" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  step >= s.num
                    ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  step >= s.num ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl shadow-emerald-950/20">
          {errorMsg && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Owner Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  STEP 1 OF 3
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">Owner & Account Details</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your credentials to manage your library portal.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name (Owner / Adhyaksha)</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="ownerName"
                    required
                    placeholder="e.g. Adhyaksha Patil"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Mobile Number (Primary Login)</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    name="ownerMobile"
                    required
                    placeholder="10-digit mobile (e.g. 9876543210)"
                    value={formData.ownerMobile}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Email Address (Optional)</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    name="ownerEmail"
                    placeholder="e.g. owner@studycentre.in"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Account Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
              >
                Continue to Library Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Library Setup Information */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  STEP 2 OF 3
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">Study Centre Configuration</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure your reading hall branding, desks, and location.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Study Centre / Library Name</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="libraryName"
                    required
                    placeholder="e.g. StudyPlus Abhyasika"
                    value={formData.libraryName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Pune / Sambhajinagar"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Total Physical Desks</label>
                  <select
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={24}>24 Desks (Small Hall)</option>
                    <option value={48}>48 Desks (Standard - 2 Floors)</option>
                    <option value={72}>72 Desks (Large Hall)</option>
                    <option value={100}>100+ Desks (Campus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Full Address</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="address"
                    placeholder="e.g. Plot 12, Near Modern College, Shivaji Nagar"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Auto-Provisioned for Your Workspace:
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>4 Standard Study Shifts (Morning, Afternoon, Evening, 24-Hr)</li>
                  <li>4 Tariff Fee Plans (Monthly AC with registration fee)</li>
                  <li>Live Interactive 48-Desk Seat Matrix (with 24-hr shift override locking)</li>
                  <li>Free 30-Day Growth Plan SaaS license activated immediately</li>
                </ul>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Verify & Activate
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP Verification Simulation */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  STEP 3 OF 3
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">Mobile OTP Verification</h2>
                <p className="text-xs text-slate-400 mt-1">
                  We sent a 4-digit verification code to <span className="text-white font-semibold">{formData.ownerMobile}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                <span className="font-bold">Sandbox Demonstration Code:</span> Enter <span className="font-mono font-bold text-white">4289</span> or click activate.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Enter 4-Digit OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.otpCode}
                  onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-3 text-center text-xl font-mono tracking-widest text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {isLoading ? "Provisioning Study Centre..." : "Complete Setup & Launch"}
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Workspace Launch */}
          {step === 4 && successResult && (
            <div className="text-center space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  WORKSPACE ACTIVATED
                </span>
                <h2 className="text-2xl font-black text-white mt-2">
                  Welcome to GranthSetu!
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Your library has been provisioned and assigned unique tenant ID:
                </p>
                <div className="mt-3 inline-block rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-base font-bold text-emerald-400">
                  {successResult.library?.code}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Library Name:</span>
                  <span className="font-semibold text-white">{successResult.library?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Public Website URL:</span>
                  <Link
                    href={successResult.library?.publicUrl || "#"}
                    className="font-mono text-emerald-400 hover:underline"
                    target="_blank"
                  >
                    {successResult.library?.publicUrl}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Initial Desks:</span>
                  <span className="font-semibold text-white">{successResult.library?.totalSeats} Physical Desks</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/owner"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Enter Owner Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500">
        © 2026 Enterprenex Solution Pvt. Ltd. • GranthSetu Abhyasika Management Platform
      </footer>
    </div>
  );
}
