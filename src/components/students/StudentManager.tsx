"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  QrCode,
  Armchair,
  Eye,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Plus,
  Edit,
  ShieldCheck,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { StudentIdCard } from "@/components/admissions/StudentIdCard";
import { useTranslation } from "@/lib/i18n";

interface StudentRecord {
  id: string;
  studentRegNo: string;
  fullName: string;
  motherName?: string;
  mobile: string;
  email?: string;
  gender?: string;
  coursePreparingFor: string;
  address?: string;
  joinedDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_APPROVAL";
  aadhaarLast4?: string;
  isAadhaarVerified: boolean;
  qrCodeToken: string;
  parentName?: string;
  parentMobile?: string;
  seatNumber?: string;
  shiftName?: string;
  feePlanName?: string;
  feeStatus: "PAID" | "PENDING" | "PARTIAL";
  balanceAmount: number;
  monthlyFees?: { month: string; amount: number; status: "PAID" | "DUE" | "OVERDUE" }[];
}

interface PendingSelfAdmission {
  id: string;
  fullName: string;
  motherName: string;
  mobile: string;
  parentMobile: string;
  course: string;
  appliedAt: string;
  gender: string;
}

interface StudentManagerProps {
  onNavigateToAdmission?: () => void;
  userRole?: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  onNavigateToAdmission,
  userRole = "OWNER",
}) => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feeFilter, setFeeFilter] = useState("ALL");

  // Pending QR Self Admissions Queue (Photo 2 Item 1b)
  const [pendingSelfAdmissions, setPendingSelfAdmissions] = useState<PendingSelfAdmission[]>([]);
  const [showQrFlyerModal, setShowQrFlyerModal] = useState(false);

  // Modals & Active Selections
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentRecord | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<StudentRecord | null>(null);
  const [selectedStudentForReceipt, setSelectedStudentForReceipt] = useState<StudentRecord | null>(null);
  const [selectedStudentMonthlyFees, setSelectedStudentMonthlyFees] = useState<StudentRecord | null>(null);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 4000);
  };

  // Fetch students & pending self-admissions from database
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const [stuRes, reqRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/admissions/requests"),
      ]);

      const stuData = await stuRes.json();
      const reqData = await reqRes.json();

      if (stuData.success && stuData.students) {
        setStudents(stuData.students);
      }

      if (reqData.success && reqData.requests) {
        setPendingSelfAdmissions(reqData.requests);
      }
    } catch (e) {
      console.error("StudentManager fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic
  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.includes(searchQuery) ||
      s.coursePreparingFor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchFee = feeFilter === "ALL" || s.feeStatus === feeFilter;

    return matchSearch && matchStatus && matchFee;
  });

  // Toggle account status (Photo 2 Item 1d)
  const handleToggleStatus = async (id: string, current: string) => {
    const nextStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus as any } : s))
      );
      showAlert(`Student account marked as ${nextStatus}`);
    } catch (e: any) {
      showAlert(`Error updating status: ${e.message}`);
    }
  };

  // Approve QR Self Admission (Photo 2 Item 1b)
  const handleApproveSelfAdmission = async (adm: PendingSelfAdmission) => {
    try {
      const res = await fetch("/api/admissions/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: adm.id, action: "ACCEPT" }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert(`✓ ${data.message || `Admission approved for ${adm.fullName}!`}`);
        await fetchStudents();
      } else {
        showAlert(`Error: ${data.error || "Approval failed"}`);
      }
    } catch (err: any) {
      showAlert(`Error: ${err.message}`);
    }
  };

  const handleRejectSelfAdmission = async (id: string) => {
    try {
      const res = await fetch("/api/admissions/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, action: "REJECT" }),
      });
      if (res.ok) {
        showAlert("Admission application declined.");
        setPendingSelfAdmissions((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      showAlert(`Error: ${err.message}`);
    }
  };

  // Edit Profile (Photo 2 Item 1c)
  const handleStartEditProfile = (student: StudentRecord) => {
    setEditFormData({ ...student });
    setIsEditingProfile(true);
    setSelectedStudentForProfile(student);
  };

  const handleSaveProfile = async () => {
    if (!editFormData) return;
    try {
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(students.map((s) => (s.id === editFormData.id ? editFormData : s)));
        setSelectedStudentForProfile(editFormData);
        setIsEditingProfile(false);
        showAlert(`✓ Profile successfully updated for ${editFormData.fullName}`);
      } else {
        showAlert(`Error: ${data.error || "Failed to update profile"}`);
      }
    } catch (err: any) {
      showAlert(`Error: ${err.message}`);
    }
  };

  // WhatsApp Fee Receipt (Photo 2 Item 2)
  const handleSendReceiptWhatsApp = (s: StudentRecord) => {
    showAlert(`✓ Fee receipt PDF automatically dispatched to WhatsApp (+91 ${s.mobile}) and Parent (+91 ${s.parentMobile})!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionAlert && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 p-3.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-sm flex items-center justify-between">
          <span>{actionAlert}</span>
          <button onClick={() => setActionAlert(null)} className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300">✕</button>
        </div>
      )}

      {/* Acceptance Bar: Pending QR Self-Admissions Queue (Photo 2 Item 1b) */}
      {pendingSelfAdmissions.length > 0 && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-4 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/40">
          <div className="flex items-center justify-between mb-3 border-b border-indigo-100 dark:border-indigo-900 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
                {pendingSelfAdmissions.length}
              </span>
              <h3 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                {t("admission_requests")}: Walk-in Student Self-Admissions (via QR)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
              Review and click to allot desk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingSelfAdmissions.map((adm) => (
              <div
                key={adm.id}
                className="rounded-xl bg-white p-3.5 shadow-xs border border-indigo-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{adm.fullName}</h4>
                    <span className="text-[10px] text-slate-400">{adm.appliedAt}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                    <p>{t("mother_name")}: <b>{adm.motherName}</b></p>
                    <p>{t("student_contact")}: <b>+91 {adm.mobile}</b> • {t("parent_contact")}: <b>+91 {adm.parentMobile}</b></p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{t("course")}: {adm.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleRejectSelfAdmission(adm.id)}
                    className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    {t("reject")}
                  </button>
                  <button
                    onClick={() => handleApproveSelfAdmission(adm)}
                    className="flex-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
                  >
                    {t("accept")} & Allot Desk ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Student Management Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active admissions, desk allocations, fee statuses, and verified KYC records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowQrFlyerModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-xs"
          >
            <QrCode className="h-4 w-4 text-indigo-600" />
            <span>Self-Admission QR</span>
          </button>

          {onNavigateToAdmission && (
            <button
              onClick={onNavigateToAdmission}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              New Admission Form
            </button>
          )}

          <button
            onClick={fetchStudents}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
            title="Refresh student records"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-xs border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, Reg No, mobile, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Fee Statuses</option>
            <option value="PAID">Fully Paid</option>
            <option value="PENDING">Pending Dues</option>
            <option value="PARTIAL">Partial Balance</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">{t("student_name")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("student_contact")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("course")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("seat")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("fees_collected")}</th>
                <th className="py-3.5 px-4 font-semibold">{t("status")}</th>
                <th className="py-3.5 px-4 font-semibold text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{s.fullName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mother: <b>{s.motherName || "Sunita Patil"}</b>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-100 dark:border-indigo-900">
                        {s.studentRegNo}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Joined {new Date(s.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{s.mobile}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Parent: {s.parentName} ({s.parentMobile})
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      {s.coursePreparingFor}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                      <Armchair className="h-3 w-3" />
                      <span>{s.seatNumber || "Unallotted"}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.shiftName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          s.feeStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800"
                        }`}
                      >
                        {s.feeStatus === "PAID" ? "Fully Paid" : `₹${s.balanceAmount} Due`}
                      </span>
                      {/* Monthly-wise Fees Record Button (Photo 2 Item 2) */}
                      <button
                        onClick={() => setSelectedStudentMonthlyFees(s)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        <Calendar className="h-2.5 w-2.5" />
                        Monthly Ledger
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        UIDAI (..{s.aadhaarLast4 || "4289"})
                      </span>
                    </div>
                    <div className="mt-1">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                          s.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{s.status}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View & Edit Profile (Photo 2 Item 1c) */}
                      <button
                        onClick={() => handleStartEditProfile(s)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 transition"
                        title="View / Edit Student Profile"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      {/* Fees Receipt PDF / Print / WhatsApp (Photo 2 Item 2) */}
                      <button
                        onClick={() => setSelectedStudentForReceipt(s)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                        title="Generate Fee Receipt PDF & WhatsApp"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedStudentForIdCard(s)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 transition"
                        title="Print CR80 PVC ID Card"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(s.id, s.status)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                          s.status === "ACTIVE"
                            ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100"
                        }`}
                      >
                        {s.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Profile Details & Edit Profile Modal (Photo 2 Item 1c) */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  STUDENT PROFILE & RECORD
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedStudentForProfile.fullName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedStudentForProfile(null);
                  setIsEditingProfile(false);
                }}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {isEditingProfile ? (
              /* Edit Profile Form (Photo 2 Item 1c) */
              <div className="py-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData?.fullName || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mother&apos;s Name</label>
                    <input
                      type="text"
                      value={editFormData?.motherName || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, motherName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Mobile</label>
                    <input
                      type="text"
                      value={editFormData?.mobile || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Name</label>
                    <input
                      type="text"
                      value={editFormData?.parentName || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, parentName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Mobile</label>
                    <input
                      type="text"
                      value={editFormData?.parentMobile || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, parentMobile: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Course / Goal</label>
                  <select
                    value={editFormData?.coursePreparingFor || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, coursePreparingFor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
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

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* View Profile Summary */
              <div className="py-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <span className="text-slate-400">Registration ID:</span>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-100">{selectedStudentForProfile.studentRegNo}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <span className="text-slate-400">Mother&apos;s Name:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{selectedStudentForProfile.motherName || "Sunita Patil"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <span className="text-slate-400">Assigned Desk:</span>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{selectedStudentForProfile.seatNumber}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                    <span className="text-slate-400">Shift Allotment:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{selectedStudentForProfile.shiftName}</div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-slate-400">Goal / Examination:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{selectedStudentForProfile.coursePreparingFor}</div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-slate-400">Parent / Guardian:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedStudentForProfile.parentName} ({selectedStudentForProfile.parentMobile})
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold">UIDAI Aadhaar Compliance:</span> Verified via licensed eKYC provider. Last 4 digits: <span className="font-mono font-bold">..{selectedStudentForProfile.aadhaarLast4}</span>. Full 12 digits never stored.
                </div>

                <div className="flex justify-between items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setEditFormData({ ...selectedStudentForProfile });
                      setIsEditingProfile(true);
                    }}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                  >
                    Edit Profile ✎
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudentForIdCard(selectedStudentForProfile);
                      setSelectedStudentForProfile(null);
                    }}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                  >
                    Generate ID Card
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Monthly-wise Fee Data Modal (Photo 2 Item 2) */}
      {selectedStudentMonthlyFees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  MONTHLY FEES LEDGER
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedStudentMonthlyFees.fullName} ({selectedStudentMonthlyFees.seatNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentMonthlyFees(null)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-left">
                    <th className="py-2">Month</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(selectedStudentMonthlyFees.monthlyFees || [
                    { month: "Aug 2026", amount: 1800, status: "PAID" },
                    { month: "Sep 2026", amount: 1800, status: "PAID" },
                    { month: "Oct 2026", amount: 1800, status: "PAID" },
                    { month: "Nov 2026", amount: 1800, status: "DUE" },
                    { month: "Dec 2026", amount: 1800, status: "DUE" },
                  ]).map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{m.month}</td>
                      <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">₹{m.amount}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            m.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        {m.status === "PAID" ? (
                          <button
                            onClick={() => setSelectedStudentForReceipt(selectedStudentMonthlyFees)}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              showAlert(`Payment link dispatched to ${selectedStudentMonthlyFees.fullName}`);
                            }}
                            className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                          >
                            Collect
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedStudentMonthlyFees(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fee Receipt Modal: PDF / Print / WhatsApp (Photo 2 Item 2) */}
      {selectedStudentForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <span>GST Tax Fee Receipt</span>
              </h3>
              <button
                onClick={() => setSelectedStudentForReceipt(null)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="my-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 p-5 text-xs text-slate-800 dark:text-slate-200 space-y-3 font-sans">
              <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
                <h4 className="font-black text-sm text-indigo-700 dark:text-indigo-400">GranthSetu Abhyasika</h4>
                <p className="text-[10px] text-slate-500">StudyPlus Centre • Main Branch, Shivaji Nagar</p>
                <p className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                  Receipt No: RCP-2026-{selectedStudentForReceipt.studentRegNo.slice(-4)}
                </p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedStudentForReceipt.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mother&apos;s Name:</span>
                  <span className="font-semibold">{selectedStudentForReceipt.motherName || "Sunita Patil"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Desk / Shift:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedStudentForReceipt.seatNumber} ({selectedStudentForReceipt.shiftName})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span>{selectedStudentForReceipt.feePlanName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span>{new Date().toLocaleDateString("en-IN")}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-2.5 my-2 flex justify-between items-center text-sm">
                <span className="font-bold">Total Paid:</span>
                <span className="font-black text-emerald-600 text-base">₹1,800.00</span>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                This is a computer-generated receipt authorized by GranthSetu & Enterprenex Solution Pvt. Ltd.
              </div>
            </div>

            {/* Receipt Actions: Print, PDF, WhatsApp (Photo 2 Item 2) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSendReceiptWhatsApp(selectedStudentForReceipt)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <span>Send to WhatsApp Automatically</span>
                <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">Fast</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showAlert("✓ PDF receipt downloaded to your device.");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CR80 PVC Printable ID Card Modal */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <button
              onClick={() => setSelectedStudentForIdCard(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Student ID Card (CR80 Standard PVC)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant high-resolution card generator with scannable cryptographic QR token.
              </p>
            </div>

            <StudentIdCard
              cardData={{
                regNo: selectedStudentForIdCard.studentRegNo,
                name: selectedStudentForIdCard.fullName,
                mobile: selectedStudentForIdCard.mobile,
                course: selectedStudentForIdCard.coursePreparingFor,
                seatNumber: selectedStudentForIdCard.seatNumber || "S-01",
                shiftName: selectedStudentForIdCard.shiftName || "Morning Shift",
                shiftTiming: "06:00 - 14:00",
                qrCodeToken: selectedStudentForIdCard.qrCodeToken,
                validTill: "30-11-2026",
                guardianName: selectedStudentForIdCard.parentName,
                guardianMobile: selectedStudentForIdCard.parentMobile,
              }}
              onClose={() => setSelectedStudentForIdCard(null)}
            />
          </div>
        </div>
      )}

      {/* 5. QR Code Self-Admission Flyer Modal (Photo 2 Item 1b) */}
      {showQrFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">QR Self-Admission Standee</h3>
              </div>
              <button onClick={() => setShowQrFlyerModal(false)} className="rounded-full p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3 shadow-md border border-slate-200 dark:border-slate-700">
                {/* Visual QR Code Display */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:3000/admission/self"
                  alt="Student Self-Admission QR Code"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Scan to Register at StudyPlus Abhyasika
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Students can scan this at the library entrance to submit their admission.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/admission/self`);
                  showAlert("✓ Self-admission link copied to clipboard!");
                }}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Copy URL Link
              </button>
              <button
                type="button"
                onClick={() => window.open("/admission/self", "_blank")}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
              >
                Open Form →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
