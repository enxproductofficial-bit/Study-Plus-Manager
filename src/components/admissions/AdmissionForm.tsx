"use client";

import React, { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  MessageSquare,
  QrCode,
} from "lucide-react";

export const AdmissionForm: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "UPSC Civil Services",
    gender: "Male",
    parentName: "",
    parentRelation: "Father",
    parentMobile: "",
    shift: "Morning (06:00 - 14:00)",
    seatNumber: "S-15",
    plan: "Monthly Morning - AC (₹1,500/mo)",
    paymentMode: "UPI",
    initialPayment: "1500",
  });

  // Verification states (CR-01 requirement)
  const [studentMobileVerified, setStudentMobileVerified] = useState(false);
  const [parentMobileVerified, setParentMobileVerified] = useState(false);
  const [aadhaarConsent, setAadhaarConsent] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarLast4, setAadhaarLast4] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handlers for OTP simulation
  const handleVerifyStudentMobile = () => {
    if (formData.mobile.length >= 10) {
      setStudentMobileVerified(true);
    }
  };

  const handleVerifyParentMobile = () => {
    if (formData.parentMobile.length >= 10) {
      setParentMobileVerified(true);
    }
  };

  const handleAadhaarVerify = () => {
    if (aadhaarInput.length === 12 && aadhaarConsent) {
      setAadhaarLast4(aadhaarInput.slice(-4));
      setAadhaarVerified(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admission & Seat Allotment Confirmed!
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Student Reg No: <span className="font-mono font-bold text-indigo-600">STU-2026-0042</span> | Allotted Seat:{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">{formData.seatNumber}</span>
          </p>
        </div>

        {/* Dual Message Trigger Confirmation (Project Rule) */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-left space-y-2 dark:border-indigo-950 dark:bg-indigo-950/40">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-semibold text-xs uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" />
            Dual WhatsApp & SMS Dispatched
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>✓ <b>Student Mobile ({formData.mobile}):</b> Welcome message, Seat {formData.seatNumber}, QR token link</p>
            <p>✓ <b>Parent Mobile ({formData.parentMobile}):</b> Admission confirmation & fee receipt link sent</p>
          </div>
        </div>

        {/* ID Card & QR Preview */}
        <div className="mx-auto max-w-sm rounded-xl border-2 border-dashed border-slate-200 p-4 text-center dark:border-slate-800">
          <div className="flex items-center justify-center gap-3">
            <QrCode className="h-16 w-16 text-slate-800 dark:text-slate-200" />
            <div className="text-left text-xs">
              <p className="font-bold text-slate-900 dark:text-white">{formData.fullName}</p>
              <p className="text-slate-500">{formData.course}</p>
              <p className="text-indigo-600 font-semibold">{formData.shift}</p>
              <p className="text-slate-400 font-mono">ID: GS-2026-0042</p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
            Print Ready ID Card (PDF)
          </button>
        </div>

        <button
          onClick={() => setIsSubmitted(false)}
          className="text-xs text-indigo-600 hover:underline font-semibold"
        >
          ← Admit Another Student
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Admission & eKYC Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with CR-01: Dual phone OTP, Aadhaar last-4 storage, and seat reservation
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          Module 07
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Student Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            1. Student Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ramesh Kulkarni"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Student Mobile + OTP Verify */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Student Mobile (OTP Required) *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="tel"
                  placeholder="9876543210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleVerifyStudentMobile}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    studentMobileVerified
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {studentMobileVerified ? "Verified ✓" : "Verify OTP"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Exam / Course
              </label>
              <input
                type="text"
                placeholder="UPSC, MPSC, CA, Banking, NEET"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Parent / Guardian Details (CR-01 Requirement) */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Parent / Guardian Contact (Dual Notification)
            </h3>
            <span className="text-[11px] text-indigo-600 font-medium">Receives fees & admission alerts</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                required
                type="text"
                placeholder="Guardian Full Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Relation
              </label>
              <select
                value={formData.parentRelation}
                onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Parent Mobile (OTP-Verified) *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="tel"
                  placeholder="9823000000"
                  value={formData.parentMobile}
                  onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleVerifyParentMobile}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    parentMobileVerified
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {parentMobileVerified ? "Verified ✓" : "Verify OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Aadhaar eKYC Verification (UIDAI Compliant - Last 4 digits only) */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              3. Aadhaar eKYC Verification (Digio / Setu)
            </h3>
            <span className="text-[11px] text-slate-500">UIDAI Safe: Full number never saved</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={aadhaarConsent}
                onChange={(e) => setAadhaarConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300">
                I hereby provide explicit consent to GranthSetu Abhyasika to verify my identity via UIDAI OTP eKYC. I understand only the last 4 digits will be retained.
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="password"
                maxLength={12}
                placeholder="Enter 12-digit Aadhaar number"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ""))}
                disabled={!aadhaarConsent || aadhaarVerified}
                className="w-64 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />

              <button
                type="button"
                onClick={handleAadhaarVerify}
                disabled={!aadhaarConsent || aadhaarInput.length !== 12 || aadhaarVerified}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  aadhaarVerified
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
                }`}
              >
                {aadhaarVerified ? `Verified (•••• •••• ${aadhaarLast4}) ✓` : "Send UIDAI OTP"}
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Seat Allotment & Plan */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            4. Shift, Seat & Fee Plan
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Shift
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Morning (06:00 - 14:00)</option>
                <option>Afternoon (14:00 - 22:00)</option>
                <option>Evening (18:00 - 23:00)</option>
                <option>24-Hour Full Day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Seat Number
              </label>
              <input
                type="text"
                value={formData.seatNumber}
                onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 font-mono font-bold focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Initial Fee Collection (₹)
              </label>
              <input
                type="number"
                value={formData.initialPayment}
                onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Complete Admission & Issue ID Card
          </button>
        </div>
      </form>
    </div>
  );
};

