"use client";

import React, { useState } from "react";
import {
  Receipt,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  CreditCard,
  Send,
  Filter,
} from "lucide-react";

interface StudentFeeRecord {
  id: string;
  studentName: string;
  regNo: string;
  mobile: string;
  parentMobile: string;
  seatNumber: string;
  shift: string;
  planName: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: "PAID" | "PARTIAL" | "OVERDUE";
}

const mockFeeRecords: StudentFeeRecord[] = [
  {
    id: "f1",
    studentName: "Aditya Patil",
    regNo: "STU-2026-0012",
    mobile: "+91 9822114455",
    parentMobile: "+91 9422001122",
    seatNumber: "S-08",
    shift: "Morning (06:00 - 14:00)",
    planName: "Monthly Morning AC",
    totalAmount: 1800,
    paidAmount: 1800,
    balanceAmount: 0,
    dueDate: "2026-11-01",
    status: "PAID",
  },
  {
    id: "f2",
    studentName: "Pooja Shinde",
    regNo: "STU-2026-0019",
    mobile: "+91 9766223344",
    parentMobile: "+91 9822334455",
    seatNumber: "S-14",
    shift: "24-Hour Full Day",
    planName: "24-Hr Premium AC",
    totalAmount: 3200,
    paidAmount: 2000,
    balanceAmount: 1200,
    dueDate: "2026-10-31",
    status: "PARTIAL",
  },
  {
    id: "f3",
    studentName: "Siddharth Rao",
    regNo: "STU-2026-0027",
    mobile: "+91 9890123456",
    parentMobile: "+91 9423123456",
    seatNumber: "S-22",
    shift: "Evening (18:00 - 23:00)",
    planName: "Monthly Evening AC",
    totalAmount: 1400,
    paidAmount: 0,
    balanceAmount: 1400,
    dueDate: "2026-10-25",
    status: "OVERDUE",
  },
];

export const FeeManager: React.FC = () => {
  const [records] = useState<StudentFeeRecord[]>(mockFeeRecords);
  const [filter, setFilter] = useState<string>("ALL");
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const sendDueReminder = (student: StudentFeeRecord) => {
    setActiveAlert(
      `Dual reminder dispatched to Student (${student.mobile}) and Parent (${student.parentMobile}) via WhatsApp & SMS.`
    );
    setTimeout(() => setActiveAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Alert toast for dual notification */}
      {activeAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 animate-in fade-in slide-in-from-top-2">
          <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span>{activeAlert}</span>
        </div>
      )}

      {/* Top statistics cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Due Balance</span>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">₹2,600</div>
          <span className="text-xs text-slate-400">2 students have pending balances</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Collection</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">₹3,800</div>
          <span className="text-xs text-slate-400">Auto-reconciled via Razorpay & Cash</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gateway Status</span>
            <CreditCard className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            Razorpay Webhooks Active
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Secret Verified & Idempotent
          </span>
        </div>
      </div>

      {/* Fee Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Student Fee Ledger & Dues</h3>
            <p className="text-xs text-slate-500">Track collections, issue sequential receipts & trigger dual reminders</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Records</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="PARTIAL">Partial Only</option>
              <option value="PAID">Fully Paid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Student & Seat</th>
                <th className="px-5 py-3">Fee Plan</th>
                <th className="px-5 py-3">Total / Paid</th>
                <th className="px-5 py-3">Balance</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{r.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {r.regNo} • Seat {r.seatNumber}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                    <div>{r.planName}</div>
                    <div className="text-[11px] text-slate-400">{r.shift}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-900 dark:text-white font-semibold">₹{r.totalAmount}</div>
                    <div className="text-[11px] text-emerald-600">Paid: ₹{r.paidAmount}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-rose-600">
                    ₹{r.balanceAmount}
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                    {r.dueDate}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        r.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : r.status === "PARTIAL"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.balanceAmount > 0 && (
                        <button
                          onClick={() => sendDueReminder(r)}
                          title="Send Dual Reminder to Student & Parent"
                          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                        >
                          <Send className="h-3 w-3" />
                          Remind
                        </button>
                      )}
                      <button
                        title="Download Sequential PDF Receipt"
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Receipt className="h-3 w-3" />
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

