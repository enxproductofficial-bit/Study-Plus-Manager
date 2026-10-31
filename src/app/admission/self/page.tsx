"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  QrCode,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function StudentSelfAdmissionPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    mobile: "",
    email: "",
    gender: "Male",
    parentName: "",
    parentMobile: "",
    course: "Competitive exam (UPSC / MPSC)",
    preferredShift: "Morning Shift (06:00 - 14:00)",
    aadhaarLast4: "",
    aadhaarConsent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/admissions/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmitSuccess({
        requestId: data.requestId || "REQ-2026-0042",
        studentName: formData.fullName,
        course: formData.course,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white">GranthSetu</span>
              <span className="block text-[10px] text-teal-400 font-semibold leading-none">Self-Admission Portal</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {submitSuccess ? (
          <div className="rounded-3xl border border-teal-500/30 bg-slate-950/80 p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/30">
                Application Submitted Successfully
              </span>
              <h2 className="text-2xl font-black text-white mt-3">
                Welcome, {submitSuccess.studentName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your admission request has been sent to the library owner counter. Your desk and CR80 ID card will be verified upon arrival.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Application Ref:</span>
                <span className="font-mono font-bold text-teal-400">{submitSuccess.requestId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Target Exam / Course:</span>
                <span className="font-semibold text-slate-200">{submitSuccess.course}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-amber-400">Pending Counter Approval</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitSuccess(null);
                setFormData({
                  fullName: "",
                  motherName: "",
                  mobile: "",
                  email: "",
                  gender: "Male",
                  parentName: "",
                  parentMobile: "",
                  course: "Competitive exam (UPSC / MPSC)",
                  preferredShift: "Morning Shift (06:00 - 14:00)",
                  aadhaarLast4: "",
                  aadhaarConsent: true,
                });
              }}
              className="w-full rounded-2xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-[11px] font-bold text-teal-400 mb-2">
                <QrCode className="h-3.5 w-3.5" />
                <span>StudyPlus Abhyasika • Shivaji Nagar</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Student Self-Admission Form
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Fill your details below. You will receive an instant admission confirmation on WhatsApp.
              </p>
            </div>

            {submitError && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs font-semibold text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Student Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  1. Student Details
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aditya Prakash Patil"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mother&apos;s Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sunita Patil"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-mono font-bold text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Male" className="bg-slate-900 text-white">Male</option>
                      <option value="Female" className="bg-slate-900 text-white">Female</option>
                      <option value="Other" className="bg-slate-900 text-white">Other</option>
                    </select>
                  </div>
                </div>

                {/* Course Dropdown (Photo 2 Item 1a exact 4 options) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Exam / Course *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Competitive exam (UPSC / MPSC)" className="bg-slate-900 text-white">
                      1. Competitive exam (UPSC / MPSC)
                    </option>
                    <option value="SSC / Banking" className="bg-slate-900 text-white">
                      2. SSC / Banking
                    </option>
                    <option value="NEET / JEE / CET" className="bg-slate-900 text-white">
                      3. NEET / JEE / CET
                    </option>
                    <option value="Others" className="bg-slate-900 text-white">
                      4. Others
                    </option>
                  </select>
                </div>
              </div>

              {/* 2. Parent / Guardian Details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  2. Parent / Guardian Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Prakash Patil"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Parent Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="Parent mobile number"
                      value={formData.parentMobile}
                      onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value.replace(/\D/g, "") })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-mono font-bold text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shift Preference */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  3. Preferred Shift
                </h3>

                <select
                  value={formData.preferredShift}
                  onChange={(e) => setFormData({ ...formData, preferredShift: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Morning Shift (06:00 - 14:00)" className="bg-slate-900 text-white">Morning Shift (06:00 AM - 02:00 PM)</option>
                  <option value="Afternoon Shift (14:00 - 22:00)" className="bg-slate-900 text-white">Afternoon Shift (02:00 PM - 10:00 PM)</option>
                  <option value="Evening Shift (18:00 - 00:00)" className="bg-slate-900 text-white">Evening Shift (06:00 PM - 12:00 AM)</option>
                  <option value="24-Hour Full Day Access" className="bg-slate-900 text-white">24-Hour Unlimited Full Day Access</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:from-blue-700 hover:to-teal-700 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Self-Admission Application</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  🔒 UIDAI Safe: Compliant with digital storage regulations.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
