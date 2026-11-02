"use client";

import React, { useRef } from "react";
import { Printer, Download, Share2, X } from "lucide-react";

export interface FeeReceiptData {
  receiptNo: string;
  issueDate?: string;
  studentName: string;
  studentContact: string;
  parentContact?: string;
  address?: string;
  feesPaid: number;
  paymentMode: string;
  nextDueDate?: string;
  branchName?: string;
  branchAddress?: string;
}

interface ChanakyaFeeReceiptModalProps {
  receipt: FeeReceiptData | null;
  onClose: () => void;
}

// Convert numeric amount to formal Indian Rupees in words
export function amountToIndianWords(amount: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (!amount || amount === 0) return "Rupees Zero Only";

  const num = Math.round(amount);

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 !== 0 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 !== 0 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "")
    );
  }

  return `(Rupees ${convert(num)} Only)`;
}

export const ChanakyaFeeReceiptModal: React.FC<ChanakyaFeeReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  // Format today's date if issueDate not provided (DD/MM/YYYY)
  const today = new Date();
  const defaultIssueDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  // Next due date: default to 1 month from today
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const defaultNextDueDate = `01-${String(nextMonth.getMonth() + 1).padStart(
    2,
    "0"
  )}-${nextMonth.getFullYear()}`;

  const issueDate = receipt.issueDate || defaultIssueDate;
  const nextDueDate = receipt.nextDueDate || defaultNextDueDate;
  const formattedAmountWords = amountToIndianWords(receipt.feesPaid);

  // Receipt numbering: ensure CA/... style
  let receiptNumber = receipt.receiptNo;
  if (!receiptNumber.startsWith("CA/")) {
    const rawDigits = receiptNumber.replace(/\D/g, "").slice(-4) || "01";
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    receiptNumber = `CA/${currentYear}/${currentMonth}/${rawDigits}`;
  }

  const studentAddress =
    receipt.address || "Cidco Waluj Mahanagar-1, Chh. Sambhajinagar";
  const parentContactDisplay = receipt.parentContact
    ? receipt.parentContact.length >= 10
      ? receipt.parentContact
      : "XXX"
    : "XXX";

  // Handle Download PDF Action (Isolates ONLY the receipt, removing all remaining page details)
  const handleDownloadPdf = () => {
    const receiptEl = document.getElementById("chanakya-official-receipt");
    if (!receiptEl) return;

    // Create an isolated hidden iframe so ONLY the receipt is printed to PDF
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all loaded stylesheets and style tags
    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Receipt_${receipt.studentName.replace(/\\s+/g, "_")}</title>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          .isolated-receipt-container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff !important;
            padding: 10px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="isolated-receipt-container">
          ${receiptEl.innerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    // Allow 400ms for browser to render styles before opening print/save-to-PDF dialog
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide">
              Official Fees Receipt Preview
            </span>
            <span className="rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
              {receiptNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* EXACT RECEIPT DOCUMENT CONTAINER (As per uploaded PDF)                     */}
        {/* ========================================================================= */}
        <div
          ref={receiptRef}
          id="chanakya-official-receipt"
          className="bg-white p-5 sm:p-6 font-sans text-slate-900 leading-normal select-text max-w-[650px] mx-auto"
        >
          {/* 1. Header: Address + Solid Blue Line (Logo removed as requested; reserved for future upload) */}
          <div className="text-center mb-2">
            <p className="text-[11px] sm:text-[11.5px] text-slate-800 font-medium tracking-normal leading-relaxed">
              Plot No. 148, Ground Basement, Shrinanda Plaza, Cidco Waluj Mahanagar - 1, Chh. Sambhajinagar, MH 431136
            </p>
            <div className="border-b-[2.5px] border-[#1e3a8a] mt-2 mb-2 w-full" />
          </div>

          {/* 2. Receipt Title */}
          <div className="text-center my-2">
            <h2 className="text-base sm:text-[17px] font-black text-[#1e3a8a] tracking-wider uppercase inline-block pb-0.5">
              FEES RECEIPT
            </h2>
          </div>

          {/* 3. Receipt No & Issue Date Bar */}
          <div className="flex items-center justify-between text-xs sm:text-[12.5px] font-bold text-slate-900 mb-1.5 px-0.5">
            <div>
              <span>Receipt No.: </span>
              <span className="font-mono">{receiptNumber}</span>
            </div>
            <div>
              <span>Issue Date: </span>
              <span className="font-mono">{issueDate}</span>
            </div>
          </div>

          {/* 4. Structured Data Grid Table (Exact format from PDF) */}
          <div className="border-[1.5px] border-slate-700 overflow-hidden mb-2.5">
            <table className="w-full text-left text-xs sm:text-[12px] border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-[32%] sm:w-[28%] font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Student Name
                  </td>
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3">
                    {receipt.studentName}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Contact (Student)
                  </td>
                  <td className="font-mono text-slate-800 py-1.5 px-2.5 sm:px-3">
                    {receipt.studentContact}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Contact (Parents)
                  </td>
                  <td className="font-mono text-slate-800 py-1.5 px-2.5 sm:px-3">
                    {parentContactDisplay}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Address
                  </td>
                  <td className="text-slate-800 py-1.5 px-2.5 sm:px-3">
                    {studentAddress}
                  </td>
                </tr>

                <tr className="border-b border-slate-300 bg-slate-50/30">
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Fees Paid
                  </td>
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3">
                    <span>Rs. {receipt.feesPaid}/- </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 ml-1">
                      {formattedAmountWords}
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Payment Mode
                  </td>
                  <td className="font-semibold text-slate-800 py-1.5 px-2.5 sm:px-3 capitalize">
                    {receipt.paymentMode || "Cash"}
                  </td>
                </tr>

                <tr>
                  <td className="font-bold text-slate-900 py-1.5 px-2.5 sm:px-3 border-r border-slate-300 bg-slate-50/50">
                    Next Due Date
                  </td>
                  <td className="font-mono font-bold text-slate-900 py-1.5 px-2.5 sm:px-3">
                    {nextDueDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. Terms & Conditions Separator */}
          <div className="border-t-2 border-[#b91c1c] my-2" />

          {/* 6. Terms & Conditions (Word for word from PDF, compact 1-page fit) */}
          <div className="text-[9.5px] sm:text-[10px] text-slate-800 space-y-0.5 leading-snug">
            <h4 className="font-bold text-[11px] text-[#1e3a8a] mb-1">
              Terms &amp; Conditions
            </h4>
            <ol className="list-decimal list-outside pl-4 space-y-0.5">
              <li>
                Fees must be paid on or before the due date. Delay may attract a late fine or suspension of seat access.
              </li>
              <li>
                Fees once paid are non-refundable and non-transferable. Keep this receipt safe and show it on request.
              </li>
              <li>
                Maintain silence and discipline; keep mobile phones on silent; sit only on the allotted seat and follow allotted timings.
              </li>
              <li>
                Keep the premises clean. Eating, smoking, tobacco, alcohol or any intoxicating substance is prohibited. Entry of outsiders is not permitted.
              </li>
              <li>
                Misbehaviour, abusive language, quarrel, harassment or disturbance to others will not be tolerated and may lead to a warning, fine, or cancellation of membership without refund; serious cases may be reported to parents/authorities.
              </li>
              <li>
                Any damage, loss or misuse of Abhyasika property (furniture, fans, lights, CCTV, books, etc.) will be recovered from the student/parents.
              </li>
              <li>
                The Abhyasika is not responsible for loss of personal belongings or valuables.
              </li>
              <li>
                Failure to follow the rules and regulations may result in cancellation of membership without refund. Management&apos;s decision is final.
              </li>
            </ol>
          </div>

          {/* 7. Signature Block (Bottom Right) - Signature graphic removed as requested; reserved for future upload */}
          <div className="mt-3 flex justify-end">
            <div className="text-center w-48">
              {/* Reserved signature space */}
              <div className="h-10 flex items-center justify-center">
                {/* Signature will be uploaded later */}
              </div>
              <p className="font-bold text-xs text-slate-900 border-t border-slate-300 pt-1">
                Authorized Signature
              </p>
              <p className="text-[11px] text-slate-700 font-medium">
                Chanakya Abhyasika
              </p>
            </div>
          </div>

          {/* 8. Footer Note */}
          <div className="mt-2 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-500 italic">
            This is a computer-generated receipt. Payment implies acceptance of the above terms and conditions.
          </div>
        </div>

        {/* Modal Bottom Action Bar (Only Download PDF & Close) */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between gap-3 print:hidden">
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Official A5 Computer-Generated Fee Receipt
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-98"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

