"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Filter,
  Search,
  Eye,
  Check,
  X,
  Lock,
} from "lucide-react";

interface KycDocumentRecord {
  id: string;
  studentName: string;
  studentRegNo: string;
  mobile: string;
  aadhaarLast4: string;
  aadhaarProvider: string;
  isAadhaarVerified: boolean;
  photoStatus: "VERIFIED" | "PENDING";
  idProofStatus: "VERIFIED" | "PENDING";
  agreementStatus: "VERIFIED" | "PENDING";
  verifiedDate: string;
}

export const KycDocumentManager: React.FC = () => {
  const [records, setRecords] = useState<KycDocumentRecord[]>([
    {
      id: "kyc-1",
      studentName: "Revanth Polamreddy",
      studentRegNo: "GS-2026-0001",
      mobile: "9226860060",
      aadhaarLast4: "4289",
      aadhaarProvider: "DIGIO (UIDAI Licensed Gateway)",
      isAadhaarVerified: true,
      photoStatus: "VERIFIED",
      idProofStatus: "VERIFIED",
      agreementStatus: "VERIFIED",
      verifiedDate: "2026-10-30",
    },
    {
      id: "kyc-2",
      studentName: "Tejas Patil",
      studentRegNo: "GS-2026-0002",
      mobile: "9876543212",
      aadhaarLast4: "7812",
      aadhaarProvider: "DIGIO (UIDAI Licensed Gateway)",
      isAadhaarVerified: true,
      photoStatus: "VERIFIED",
      idProofStatus: "VERIFIED",
      agreementStatus: "VERIFIED",
      verifiedDate: "2026-10-29",
    },
    {
      id: "kyc-3",
      studentName: "Sneha Shinde",
      studentRegNo: "GS-2026-0003",
      mobile: "9822331144",
      aadhaarLast4: "9041",
      aadhaarProvider: "DIGIO (UIDAI Licensed Gateway)",
      isAadhaarVerified: true,
      photoStatus: "PENDING",
      idProofStatus: "VERIFIED",
      agreementStatus: "PENDING",
      verifiedDate: "2026-10-31",
    },
  ]);

  const [filter, setFilter] = useState<"ALL" | "VERIFIED" | "PENDING">("ALL");

  const handleApproveDocument = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, photoStatus: "VERIFIED", idProofStatus: "VERIFIED", agreementStatus: "VERIFIED" }
          : r
      )
    );
  };

  const filtered = records.filter((r) => {
    if (filter === "ALL") return true;
    const isAllVerified = r.photoStatus === "VERIFIED" && r.idProofStatus === "VERIFIED" && r.agreementStatus === "VERIFIED";
    return filter === "VERIFIED" ? isAllVerified : !isAllVerified;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            KYC & Identity Document Verification (CR-01)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            UIDAI Aadhaar data minimization: strictly last 4 digits retained. Raw 12 digits never stored or logged.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "VERIFIED", "PENDING"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Compliance Notice Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">UIDAI Statutory Mandate:</span> Student identity verification is authenticated through licensed eKYC providers. Under no circumstances are raw 12-digit Aadhaar numbers or OTPs stored in database logs. Only cryptographic provider references and the last four digits are preserved for verification audits.
        </div>
      </div>

      {/* Verification Records Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Student Name & ID</th>
              <th className="py-3.5 px-4 font-semibold">Aadhaar Last 4 & Gateway</th>
              <th className="py-3.5 px-4 font-semibold">Photograph</th>
              <th className="py-3.5 px-4 font-semibold">Identity Proof</th>
              <th className="py-3.5 px-4 font-semibold">Admission Consent</th>
              <th className="py-3.5 px-4 font-semibold">Date Verified</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{r.studentName}</div>
                  <div className="text-[11px] font-mono text-indigo-600 mt-0.5">{r.studentRegNo}</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>•••• •••• {r.aadhaarLast4}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{r.aadhaarProvider}</div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.photoStatus === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {r.photoStatus === "VERIFIED" ? "✓ Verified" : "⏳ Review"}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.idProofStatus === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {r.idProofStatus === "VERIFIED" ? "✓ Verified" : "⏳ Review"}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.agreementStatus === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {r.agreementStatus === "VERIFIED" ? "✓ Signed" : "⏳ Pending"}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-500 text-[11px]">{r.verifiedDate}</td>

                <td className="py-3.5 px-4 text-right">
                  {r.photoStatus === "VERIFIED" && r.idProofStatus === "VERIFIED" && r.agreementStatus === "VERIFIED" ? (
                    <span className="text-[11px] font-bold text-emerald-600">✓ Fully Verified</span>
                  ) : (
                    <button
                      onClick={() => handleApproveDocument(r.id)}
                      className="rounded-xl bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 shadow-xs"
                    >
                      Approve Documents
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
