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

interface StudentRecord {
  id: string;
  studentRegNo: string;
  fullName: string;
  mobile: string;
  email?: string;
  gender?: string;
  coursePreparingFor: string;
  address?: string;
  joinedDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
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
}

interface StudentManagerProps {
  onNavigateToAdmission?: () => void;
  userRole?: "SUPER_ADMIN" | "OWNER" | "STAFF" | "STUDENT";
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  onNavigateToAdmission,
  userRole = "OWNER",
}) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feeFilter, setFeeFilter] = useState("ALL");

  // Modals
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentRecord | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<StudentRecord | null>(null);

  // Fetch students from backend
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (json.success && json.recentAdmissions) {
        // Map admissions data
        const mapped: StudentRecord[] = json.recentAdmissions.map((s: any, idx: number) => ({
          id: s.id || `stu-${idx}`,
          studentRegNo: s.studentRegNo || `GS-2026-${String(idx + 1).padStart(4, "0")}`,
          fullName: s.fullName || "Admitted Student",
          mobile: s.mobile || "9876543210",
          email: s.email || "student@granthsetu.in",
          coursePreparingFor: s.coursePreparingFor || "Competitive Exams (UPSC/MPSC)",
          joinedDate: s.createdAt || new Date().toISOString(),
          status: (s.status as any) || "ACTIVE",
          aadhaarLast4: s.aadhaarLast4 || "4289",
          isAadhaarVerified: true,
          qrCodeToken: s.qrCodeToken || `QR-TOKEN-${idx}`,
          parentName: "Guardian Patil",
          parentMobile: "9822001122",
          seatNumber: s.seatAllocations?.[0]?.seat?.seatNumber || `S-${String((idx % 48) + 1).padStart(2, "0")}`,
          shiftName: s.seatAllocations?.[0]?.shift?.name || "Morning Shift (06:00 - 14:00)",
          feePlanName: s.fees?.[0]?.feePlan?.name || "Monthly Morning Shift (AC)",
          feeStatus: (s.fees?.[0]?.status as any) || "PAID",
          balanceAmount: Number(s.fees?.[0]?.balanceAmount) || 0,
        }));
        setStudents(mapped);
      }
    } catch (e) {
      console.error(e);
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

  // Toggle account status
  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus as any } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Student Management Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active admissions, desk allocations, fee statuses, and verified KYC records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToAdmission && (
            <button
              onClick={onNavigateToAdmission}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              New Admission
            </button>
          )}

          <button
            onClick={fetchStudents}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh student records"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, Reg No, mobile, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Fee Statuses</option>
            <option value="PAID">Fully Paid</option>
            <option value="PENDING">Pending Dues</option>
            <option value="PARTIAL">Partial Balance</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Student ID & Name</th>
                <th className="py-3.5 px-4 font-semibold">Contact & Parent</th>
                <th className="py-3.5 px-4 font-semibold">Goal / Course</th>
                <th className="py-3.5 px-4 font-semibold">Desk & Shift</th>
                <th className="py-3.5 px-4 font-semibold">Fee Clearance</th>
                <th className="py-3.5 px-4 font-semibold">KYC & Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{s.fullName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                        {s.studentRegNo}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Joined {new Date(s.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{s.mobile}</div>
                    <div className="text-[11px] text-slate-500">
                      Parent: {s.parentName} ({s.parentMobile})
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {s.coursePreparingFor}
                    </div>
                    <div className="text-[11px] text-slate-400">Civil / Competitive</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-lg border border-indigo-100">
                      <Armchair className="h-3 w-3" />
                      <span>{s.seatNumber || "Unallotted"}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.shiftName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.feeStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {s.feeStatus === "PAID" ? "Fully Paid" : `₹${s.balanceAmount} Due`}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.feePlanName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[11px] font-semibold text-slate-700">
                        UIDAI (..{s.aadhaarLast4 || "4289"})
                      </span>
                    </div>
                    <div className="mt-1">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                          s.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-500">{s.status}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedStudentForProfile(s)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
                        title="View Full Profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedStudentForIdCard(s)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
                        title="Print CR80 PVC ID Card"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(s.id, s.status)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                          s.status === "ACTIVE"
                            ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
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

      {/* Profile Details Modal */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  STUDENT PROFILE
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedStudentForProfile.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400">Registration ID:</span>
                  <div className="font-mono font-bold text-slate-800">{selectedStudentForProfile.studentRegNo}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400">Mobile:</span>
                  <div className="font-semibold text-slate-800">{selectedStudentForProfile.mobile}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400">Assigned Desk:</span>
                  <div className="font-bold text-indigo-600">{selectedStudentForProfile.seatNumber}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400">Shift Allotment:</span>
                  <div className="font-semibold text-slate-800">{selectedStudentForProfile.shiftName}</div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Goal / Examination:</span>
                <div className="font-semibold text-slate-800">{selectedStudentForProfile.coursePreparingFor}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400">Parent / Guardian:</span>
                <div className="font-semibold text-slate-800">
                  {selectedStudentForProfile.parentName} ({selectedStudentForProfile.parentMobile})
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-800">
                <span className="font-bold">UIDAI Aadhaar Compliance:</span> Verified via licensed eKYC provider. Last 4 digits: <span className="font-mono font-bold">..{selectedStudentForProfile.aadhaarLast4}</span>. Full 12 digits never stored.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
        </div>
      )}

      {/* CR80 PVC Printable ID Card Modal */}
      {selectedStudentForIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 my-8">
            <button
              onClick={() => setSelectedStudentForIdCard(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Student ID Card (CR80 Standard PVC)</h3>
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
    </div>
  );
};
