"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  IndianRupee,
  Download,
  Lock
} from "lucide-react";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMode: string;
}

const mockTransactions: Transaction[] = [
  { id: "t1", type: "INCOME", title: "Student Admission Fees (4 students)", category: "FEES", amount: 7200, date: "29 Oct 2026", paymentMode: "RAZORPAY" },
  { id: "t2", type: "EXPENSE", title: "Electricity Bill (High AC consumption)", category: "UTILITIES", amount: 4800, date: "28 Oct 2026", paymentMode: "NET_BANKING" },
  { id: "t3", type: "EXPENSE", title: "Airtel High-Speed Fiber Internet", category: "INTERNET", amount: 1499, date: "27 Oct 2026", paymentMode: "UPI" },
  { id: "t4", type: "INCOME", title: "Locker Rentals Renewal", category: "LOCKERS", amount: 1200, date: "26 Oct 2026", paymentMode: "CASH" },
  { id: "t5", type: "EXPENSE", title: "Cleaning & Housekeeping Supplies", category: "MAINTENANCE", amount: 850, date: "25 Oct 2026", paymentMode: "CASH" },
];

export const LedgerView: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Top Banner with Privacy Note */}
      <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4 border border-amber-200 dark:border-amber-900/50 dark:bg-amber-950/30">
        <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Lock className="h-4 w-4" />
          <span className="font-semibold">
            Confidential Owner Ledger: Hidden from Staff logins according to Business Rule #6.
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
          Audited & Multi-branch Scoped
        </span>
      </div>

      {/* P&L KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Incomes (Month)</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</div>
          <span className="text-xs text-slate-400">Fees + Lockers + Misc</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses (Month)</span>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">₹{totalExpense.toLocaleString()}</div>
          <span className="text-xs text-slate-400">Rent, Power, Wifi & Staff</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Operating Profit</span>
            <IndianRupee className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">₹{netProfit.toLocaleString()}</div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Positive Cash Flow</span>
        </div>
      </div>

      {/* Transactions list */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Income & Expense Transactions</h3>
            <p className="text-xs text-slate-500">Itemized ledger for monthly profit & loss accounting</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
              <Download className="h-3.5 w-3.5" />
              Export Tally / CSV
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              Add Expense
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs ${tx.type === "INCOME"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                    }`}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">{tx.title}</h5>
                  <p className="text-xs text-slate-400">
                    {tx.category} • {tx.paymentMode} • {tx.date}
                  </p>
                </div>
              </div>

              <div
                className={`font-mono text-sm font-bold ${tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                  }`}
              >
                {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

