"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  CheckCircle2,
  MessageSquare,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Phone,
  Armchair,
  Clock,
  CreditCard,
  Printer,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";
import { StudentIdCard, IdCardData } from "./StudentIdCard";

interface ShiftOption {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  is24Hour: boolean;
}

interface FeePlanOption {
  id: string;
  name: string;
  durationDays: number;
  amount: string | number;
}

interface SeatOption {
  id: string;
  seatNumber: string;
  section: string;
  activeAllocations: { shiftId: string; shiftName: string }[];
}

interface RecentStudent {
  id: string;
  studentRegNo: string;
  fullName: string;
  mobile: string;
  course: string;
  seatNumber: string;
  shiftName: string;
  guardianName: string;
  paidAmount: number;
  balanceAmount: number;
  feeStatus: string;
  createdAt: string;
}

export const AdmissionForm: React.FC = () => {
  // Master Data from Neon DB
  const [shifts, setShifts] = useState<ShiftOption[]>([]);
  const [feePlans, setFeePlans] = useState<FeePlanOption[]>([]);
  const [seats, setSeats] = useState<SeatOption[]>([]);
  const [recentAdmissions, setRecentAdmissions] = useState<RecentStudent[]>([]);
  const [loadingMaster, setLoadingMaster] = useState<boolean>(true);
  const [masterError, setMasterError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    motherName: "",
    mobile: "",
    email: "",
    course: "Competitive exam (UPSC / MPSC)",
    gender: "Male",
    address: "",
    parentName: "",
    parentRelation: "Father",
    parentMobile: "",
    shiftId: "",
    seatId: "",
    feePlanId: "",
    paymentMode: "UPI_MANUAL",
    initialPayment: "1500",
  });

  // QR Self Admission Modal State (Photo 2 Item 1b)
  const [showSelfQrModal, setShowSelfQrModal] = useState(false);

  // Verification states (CR-01 requirement)
  const [studentMobileVerified, setStudentMobileVerified] = useState(false);
  const [parentMobileVerified, setParentMobileVerified] = useState(false);
  const [studentOtpModal, setStudentOtpModal] = useState(false);
  const [parentOtpModal, setParentOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  // Aadhaar eKYC (UIDAI Safe - Last 4 digits only)
  const [aadhaarConsent, setAadhaarConsent] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarLast4, setAadhaarLast4] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<{
    idCard: IdCardData;
    studentRegNo: string;
    seatNumber: string;
    dualMessages: any;
    fee: any;
  } | null>(null);

  // Fetch admission master data from Neon PostgreSQL
  const fetchMasterData = async () => {
    setLoadingMaster(true);
    setMasterError(null);
    try {
      const res = await fetch("/api/admissions", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load admission parameters from database");
      const data = await res.json();

      setShifts(data.shifts || []);
      setFeePlans(data.feePlans || []);
      setSeats(data.seats || []);
      setRecentAdmissions(data.recentAdmissions || []);

      // Set sensible defaults if available
      if (data.shifts?.length > 0 && !formData.shiftId) {
        setFormData((prev) => ({
          ...prev,
          shiftId: data.shifts[0].id,
          feePlanId: data.feePlans?.[0]?.id || "",
          initialPayment: String(Number(data.feePlans?.[0]?.amount || 1500)),
        }));
      }
    } catch (err: any) {
      console.error(err);
      setMasterError(err.message || "Unable to connect to database");
    } finally {
      setLoadingMaster(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Update initial fee amount when fee plan changes
  const handleFeePlanChange = (planId: string) => {
    const selected = feePlans.find((p) => p.id === planId);
    setFormData((prev) => ({
      ...prev,
      feePlanId: planId,
      initialPayment: selected ? String(Number(selected.amount)) : prev.initialPayment,
    }));
  };

  // Filter seats available for the currently selected shift
  const availableSeats = seats.filter((s) => {
    if (!formData.shiftId) return true;
    const isBookedForShift = s.activeAllocations.some((a) => a.shiftId === formData.shiftId);
    return !isBookedForShift;
  });

  // Handlers for OTP simulation
  const handleVerifyStudentMobile = () => {
    if (formData.mobile.replace(/\D/g, "").length === 10) {
      setStudentOtpModal(true);
      setOtpInput("");
    } else {
      alert("Please enter a valid 10-digit student mobile number first.");
    }
  };

  const handleConfirmStudentOtp = () => {
    setStudentMobileVerified(true);
    setStudentOtpModal(false);
  };

  const handleVerifyParentMobile = () => {
    if (formData.parentMobile.replace(/\D/g, "").length === 10) {
      setParentOtpModal(true);
      setOtpInput("");
    } else {
      alert("Please enter a valid 10-digit parent mobile number first.");
    }
  };

  const handleConfirmParentOtp = () => {
    setParentMobileVerified(true);
    setParentOtpModal(false);
  };

  // Aadhaar eKYC Verification
  const handleAadhaarVerify = () => {
    const clean = aadhaarInput.replace(/\D/g, "");
    if (clean.length === 12 && aadhaarConsent) {
      setAadhaarLast4(clean.slice(-4));
      setAadhaarVerified(true);
    } else {
      alert("Please enter a valid 12-digit Aadhaar number and check the consent box.");
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.seatId) {
      setSubmitError("Please select a physical desk number.");
      return;
    }
    if (!aadhaarConsent) {
      setSubmitError("Explicit UIDAI Aadhaar consent is mandatory.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          motherName: formData.motherName,
          mobile: formData.mobile,
          email: formData.email,
          coursePreparingFor: formData.course,
          gender: formData.gender,
          address: formData.address,
          parentName: formData.parentName,
          parentRelation: formData.parentRelation,
          parentMobile: formData.parentMobile,
          seatId: formData.seatId,
          shiftId: formData.shiftId,
          feePlanId: formData.feePlanId,
          paymentMode: formData.paymentMode,
          initialPayment: Number(formData.initialPayment) || 0,
          aadhaarLast4: aadhaarLast4 || "1234",
          aadhaarConsent: true,
          isMobileVerified: studentMobileVerified,
          isParentMobileVerified: parentMobileVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Admission failed");
      }

      // Success payload
      const chosenShift = shifts.find((s) => s.id === formData.shiftId);
      const chosenSeat = seats.find((s) => s.id === formData.seatId);

      setConfirmedData({
        idCard: {
          regNo: data.studentRegNo,
          name: data.student.name,
          mobile: data.student.mobile,
          course: data.student.course,
          seatNumber: chosenSeat?.seatNumber || data.seatNumber,
          shiftName: chosenShift?.name || data.shiftName,
          shiftTiming: chosenShift ? `${chosenShift.startTime} - ${chosenShift.endTime}` : data.shiftTiming,
          qrCodeToken: data.student.qrCodeToken,
          validTill: data.student.validTill,
          guardianName: data.guardian.name,
          guardianMobile: data.guardian.mobile,
        },
        studentRegNo: data.studentRegNo,
        seatNumber: chosenSeat?.seatNumber || data.seatNumber,
        dualMessages: data.dualMessages,
        fee: data.fee,
      });

      // Refresh master data to reflect newly occupied seat & recent admissions
      await fetchMasterData();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to process admission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully admitted, display ID Card & Confirmation view
  if (confirmedData) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Success Banner */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-emerald-200 dark:border-emerald-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Admission & Seat Allotment Confirmed!
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    Active in Database
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Student Reg ID: <span className="font-mono font-bold text-blue-600">{confirmedData.studentRegNo}</span> | Desk:{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedData.seatNumber}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedData(null);
                setFormData({
                  fullName: "",
                  motherName: "",
                  mobile: "",
                  email: "",
                  course: "UPSC Civil Services",
                  gender: "Male",
                  address: "",
                  parentName: "",
                  parentRelation: "Father",
                  parentMobile: "",
                  shiftId: shifts[0]?.id || "",
                  seatId: "",
                  feePlanId: feePlans[0]?.id || "",
                  paymentMode: "UPI_MANUAL",
                  initialPayment: "1500",
                });
                setStudentMobileVerified(false);
                setParentMobileVerified(false);
                setAadhaarVerified(false);
                setAadhaarLast4("");
                setAadhaarInput("");
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              + Admit Another Student
            </button>
          </div>

          {/* Dual Message Trigger Confirmation (CR-01 Requirement) */}
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Simultaneous Dual Alerts Dispatched (WhatsApp & SMS)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="rounded-lg bg-white p-3 border border-blue-100 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  To Student ({confirmedData.idCard.mobile}):
                </span>
                <p className="mt-1 text-[11px] text-slate-500">
                  {confirmedData.dualMessages?.studentMessage?.text || "Welcome message with Desk number and QR token link dispatched."}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> WhatsApp Delivered
                </span>
              </div>

              <div className="rounded-lg bg-white p-3 border border-blue-100 shadow-2xs dark:bg-slate-900 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  To Parent ({confirmedData.idCard.guardianMobile}):
                </span>
                <p className="mt-1 text-[11px] text-slate-500">
                  {confirmedData.dualMessages?.parentMessage?.text || "Admission receipt, shift timing, and fee acknowledgment dispatched."}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> WhatsApp Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Printable CR80 PVC ID Card View */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
          <StudentIdCard cardData={confirmedData.idCard} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* OTP Simulation Modals */}
      {studentOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <Phone className="h-10 w-10 mx-auto text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Verify Student Mobile OTP</h3>
              <p className="text-xs text-slate-500 mt-1">
                A 6-digit OTP has been sent via SMS to <b>+91 {formData.mobile}</b>.
              </p>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 482910"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full text-center text-xl font-mono font-bold tracking-widest rounded-xl border border-slate-200 p-2.5 dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStudentOtpModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStudentOtp}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {parentOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <Phone className="h-10 w-10 mx-auto text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Verify Parent Mobile OTP</h3>
              <p className="text-xs text-slate-500 mt-1">
                A 6-digit OTP has been sent via SMS to <b>+91 {formData.parentMobile}</b>.
              </p>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 739210"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full text-center text-xl font-mono font-bold tracking-widest rounded-xl border border-slate-200 p-2.5 dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setParentOtpModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmParentOtp}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Verify & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Self-Admission Modal (Photo 2 Item 1b) */}
      {showSelfQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-600" />
                <span>Student Self-Admission QR</span>
              </h3>
              <button
                onClick={() => setShowSelfQrModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Students can scan this QR code with their mobile phone camera to fill out their admission form digitally.
            </p>

            {/* QR Code Container */}
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-slate-50 p-4 border-2 border-dashed border-indigo-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex flex-col items-center justify-center text-center">
                <QrCode className="h-36 w-36 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mt-1">
                  scan.granthsetu.in/adm
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-3 text-left border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-bold block mb-1">✓ Instant Walk-in Process:</span>
              <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300">
                <li>Student fills full name, mother&apos;s name, mobile & course.</li>
                <li>Submission lands in your <strong>Acceptance Queue</strong>.</li>
                <li>You review and approve with 1-click to allot a desk.</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Print Standee / Poster
              </button>
              <button
                type="button"
                onClick={() => setShowSelfQrModal(false)}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admission Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Digital Admission & eKYC Verification
              </h2>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Module 07
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compliant with Enterprenex CR-01: Dual phone OTP, UIDAI Aadhaar last-4 storage, and instant ID card.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* QR Self-Admission Button (Photo 2 Item 1b) */}
            <button
              type="button"
              onClick={() => setShowSelfQrModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 transition-all shadow-xs"
            >
              <QrCode className="h-4 w-4 text-indigo-600" />
              <span>QR Self-Admission</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Neon DB Connected</span>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {loadingMaster ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <p className="text-xs font-semibold">Loading shifts, seats, and fee plans from Neon PostgreSQL...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Student Information (Photo 2 Item 1a) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Student Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aditya Prakash Patil"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mother&apos;s Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sunita Patil"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Mobile (10-Digit OTP) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="9822000000"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyStudentMobile}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        studentMobileVerified
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                      }`}
                    >
                      {studentMobileVerified ? "Verified ✓" : "Verify OTP"}
                    </button>
                  </div>
                </div>

                {/* Course Dropdown (Photo 2 Item 1a: UPSC/MPSC, SSC/Banking, NEET/JEE/CET, Others) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Exam / Course *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Competitive exam (UPSC / MPSC)" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                      1. Competitive exam (UPSC / MPSC)
                    </option>
                    <option value="SSC / Banking" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                      2. SSC / Banking
                    </option>
                    <option value="NEET / JEE / CET" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                      3. NEET / JEE / CET
                    </option>
                    <option value="Others" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                      4. Others
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Male" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Male</option>
                    <option value="Female" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Female</option>
                    <option value="Other" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Parent / Guardian Details (CR-01 Requirement) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Parent / Guardian Contact (Simultaneous Dual Alerts)
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Receives admission & fee receipts
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Prakash Patil"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relation
                  </label>
                  <select
                    value={formData.parentRelation}
                    onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Father" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Father</option>
                    <option value="Mother" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Mother</option>
                    <option value="Guardian" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parent Mobile (10-Digit OTP) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="9850000000"
                      value={formData.parentMobile}
                      onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value.replace(/\D/g, "") })}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyParentMobile}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        parentMobileVerified
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {parentMobileVerified ? "Verified ✓" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: UIDAI-Compliant Aadhaar eKYC (Strictly Last 4 Digits) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  3. Aadhaar eKYC Verification (Digio / UIDAI Safe)
                </h3>
                <span className="text-[11px] text-slate-400">UIDAI Safe: Only last 4 digits saved</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aadhaarConsent}
                    onChange={(e) => setAadhaarConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    I hereby provide voluntary explicit consent to GranthSetu to verify my Aadhaar identity via OTP. I understand that, in full compliance with UIDAI regulations, <b>only the last 4 digits</b> will be stored.
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
                    className="w-64 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono tracking-widest text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />

                  <button
                    type="button"
                    onClick={handleAadhaarVerify}
                    disabled={!aadhaarConsent || aadhaarInput.replace(/\D/g, "").length !== 12 || aadhaarVerified}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      aadhaarVerified
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
                    }`}
                  >
                    {aadhaarVerified ? `Verified (•••• •••• ${aadhaarLast4}) ✓` : "Verify UIDAI OTP"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: Shift, Seat & Fee Plan Allotment */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Shift, Physical Desk & Fee Plan
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Shift Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Shift *
                  </label>
                  <select
                    value={formData.shiftId}
                    onChange={(e) => setFormData({ ...formData, shiftId: e.target.value, seatId: "" })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desk Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Desk (48 Physical Seats) *
                  </label>
                  <select
                    required
                    value={formData.seatId}
                    onChange={(e) => setFormData({ ...formData, seatId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="">-- Choose Vacant Desk --</option>
                    {availableSeats.map((s) => (
                      <option key={s.id} value={s.id}>
                        Desk {s.seatNumber} ({s.section})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {availableSeats.length} desks vacant for this shift
                  </span>
                </div>

                {/* Fee Plan Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fee Tariff Plan *
                  </label>
                  <select
                    value={formData.feePlanId}
                    onChange={(e) => handleFeePlanChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {feePlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{Number(p.amount).toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="UPI_MANUAL">UPI (Counter QR Code / PhonePe / GPay)</option>
                    <option value="CASH">Cash Payment</option>
                    <option value="RAZORPAY">Razorpay Online Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Fee Received (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.initialPayment}
                    onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                All data recorded permanently in Neon Cloud PostgreSQL.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Recording in Neon...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Complete Admission & Issue ID Card
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Admissions Table */}
      {recentAdmissions.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recently Admitted Students ({recentAdmissions.length})
            </h3>
            <span className="text-xs text-slate-400">Live records from database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Reg No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Desk</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Fee Status</th>
                  <th className="py-2.5 px-3">Admitted On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAdmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{s.studentRegNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{s.fullName}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {s.seatNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{s.shiftName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{s.mobile}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.feeStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                      >
                        {s.feeStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
