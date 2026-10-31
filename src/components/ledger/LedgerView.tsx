"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  IndianRupee,
  Download,
  Lock,
  Trash2,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export interface LedgerRow {
  id: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  particulars: string;
  amount: number;
  paymentMode: "CASH" | "UPI" | "NET_BANKING" | "CHEQUE";
}

const CATEGORY_OPTIONS = [
  "Student Fee Collection",
  "Locker Rentals Renewal",
  "Electricity Bill (AC & Lighting)",
  "Premises Rent",
  "High-Speed Fiber WiFi",
  "Cleaning & Housekeeping Supplies",
  "Staff Salaries & Honorarium",
  "Water & Beverage Amenities",
  "Furniture & Desk Maintenance",
  "Software & SaaS License",
  "Miscellaneous / Other",
];

export const LedgerView: React.FC = () => {
  const { t } = useTranslation();
  // Empty sheet capability (Photo 3 Item V)
  const [rows, setRows] = useState<LedgerRow[]>([
    {
      id: "row-1",
      date: "2026-10-31",
      type: "INCOME",
      category: "Student Fee Collection",
      particulars: "Monthly admission fees (3 students)",
      amount: 5400,
      paymentMode: "UPI",
    },
    {
      id: "row-2",
      date: "2026-10-30",
      type: "EXPENSE",
      category: "Electricity Bill (AC & Lighting)",
      particulars: "MSEDCL October commercial power bill",
      amount: 4200,
      paymentMode: "NET_BANKING",
    },
    {
      id: "row-3",
      date: "2026-10-29",
      type: "EXPENSE",
      category: "High-Speed Fiber WiFi",
      particulars: "Airtel 300 Mbps unlimited lease plan",
      amount: 1499,
      paymentMode: "UPI",
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto Calculations (Photo 3 Item V)
  const totalIncome = rows
    .filter((r) => r.type === "INCOME")
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const totalExpense = rows
    .filter((r) => r.type === "EXPENSE")
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  // Add Empty Row (Photo 3 Item V)
  const handleAddRow = () => {
    const newRow: LedgerRow = {
      id: `row-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: "EXPENSE",
      category: "Electricity Bill (AC & Lighting)",
      particulars: "Enter description...",
      amount: 0,
      paymentMode: "UPI",
    };
    setRows([...rows, newRow]);
    showToast("Added new editable row to sheet.");
  };

  // Update Row
  const handleUpdateRow = (id: string, field: keyof LedgerRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Delete Row
  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    showToast("Row deleted from ledger.");
  };

  // Clear to Empty Sheet (Photo 3 Item V: "Show only empty sheet")
  const handleClearSheet = () => {
    if (confirm("Are you sure you want to clear all rows and start with an empty sheet?")) {
      setRows([]);
      showToast("Sheet cleared. Ready for fresh entries.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Date,Type,Category,Particulars,Amount,PaymentMode\n";
    const csvRows = rows
      .map(
        (r) =>
          `"${r.date}","${r.type}","${r.category}","${r.particulars.replace(/"/g, '""')}",${r.amount},"${r.paymentMode}"`
      )
      .join("\n");
    const blob = new Blob([headers + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GranthSetu_PL_Sheet_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported ledger to CSV!");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 p-3 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Privacy Note */}
      <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 border border-amber-200 dark:border-amber-900/50 dark:bg-amber-950/30">
        <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Lock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span className="font-semibold">
            Confidential Owner P&L Sheet: Editable ledger with real-time auto-calculation.
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 hidden sm:inline">
          SRS Business Rule #6 Enforced
        </span>
      </div>

      {/* Auto-Calculated P&L KPI Cards (Photo 3 Item V) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Income */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("total_income")}</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{totalIncome.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-400">Student Fees & Locker Collections</span>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("total_expense")}</span>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
            ₹{totalExpense.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-400">Rent, Power, WiFi & Maintenance</span>
        </div>

        {/* Net Profit / Loss */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t("net_profit")}</span>
            <IndianRupee className="h-4 w-4 text-indigo-500" />
          </div>
          <div
            className={`mt-2 text-2xl font-black ${
              netBalance >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            ₹{netBalance.toLocaleString("en-IN")}
          </div>
          <span className={`text-[11px] font-bold ${netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
            {netBalance >= 0 ? "✓ Net Profit (Positive Cash Flow)" : "⚠ Net Loss"}
          </span>
        </div>
      </div>

      {/* Editable Interactive Spreadsheet Sheet (Photo 3 Item V) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t("pnl_heading")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directly edit cells below. Real-time auto-calculation across rows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleClearSheet}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition"
              title="Clear all rows to an empty sheet"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t("clear_sheet")}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleAddRow}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{t("add_entry")}</span>
            </button>
          </div>
        </div>

        {/* Editable Sheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-3 w-32">Date</th>
                <th className="py-3 px-3 w-28">Type</th>
                <th className="py-3 px-3 w-56">Category Dropdown</th>
                <th className="py-3 px-3">Particulars / Description</th>
                <th className="py-3 px-3 w-32">Amount (₹)</th>
                <th className="py-3 px-3 w-32">Payment Mode</th>
                <th className="py-3 px-3 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  {/* Date Input */}
                  <td className="py-2 px-3">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleUpdateRow(row.id, "date", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </td>

                  {/* Type Dropdown (INCOME / EXPENSE) */}
                  <td className="py-2 px-3">
                    <select
                      value={row.type}
                      onChange={(e) => handleUpdateRow(row.id, "type", e.target.value)}
                      className={`w-full rounded-lg border p-1.5 text-xs font-bold focus:outline-none ${
                        row.type === "INCOME"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      <option value="INCOME" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">+ Income</option>
                      <option value="EXPENSE" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">- Expense</option>
                    </select>
                  </td>

                  {/* Category Dropdown (Photo 3 Item V) */}
                  <td className="py-2 px-3">
                    <select
                      value={row.category}
                      onChange={(e) => handleUpdateRow(row.id, "category", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Particulars Text */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      placeholder="e.g. October Maintenance Bill"
                      value={row.particulars}
                      onChange={(e) => handleUpdateRow(row.id, "particulars", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </td>

                  {/* Amount Input */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      value={row.amount || ""}
                      onChange={(e) => handleUpdateRow(row.id, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-right"
                    />
                  </td>

                  {/* Payment Mode Dropdown */}
                  <td className="py-2 px-3">
                    <select
                      value={row.paymentMode}
                      onChange={(e) => handleUpdateRow(row.id, "paymentMode", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="UPI" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">UPI</option>
                      <option value="CASH" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Cash</option>
                      <option value="NET_BANKING" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Net Banking</option>
                      <option value="CHEQUE" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">Cheque</option>
                    </select>
                  </td>

                  {/* Delete Button */}
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                      title="Delete this row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-xs">Empty Sheet. Click &quot;Add Row&quot; above to add your first transaction.</p>
                  </td>
                </tr>
              )}
            </tbody>
            {/* Auto Calculated Totals Footer Row */}
            <tfoot className="bg-slate-50/90 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-slate-100">
              <tr>
                <td colSpan={4} className="py-3 px-3 text-right">
                  Auto-Calculated Totals:
                </td>
                <td className="py-3 px-3 font-mono text-right text-indigo-600 dark:text-indigo-400">
                  Net: ₹{netBalance.toLocaleString("en-IN")}
                </td>
                <td colSpan={2} className="py-3 px-3 text-slate-500">
                  Income: ₹{totalIncome} | Exp: ₹{totalExpense}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

