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

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  // Handle WhatsApp Dispatch
  const handleWhatsApp = () => {
    const cleanMobile = receipt.studentContact.replace(/\D/g, "").slice(-10);
    const text =
      `*CHANAKYA ABHYASIKA - FEES RECEIPT*\n` +
      `------------------------------------------\n` +
      `Receipt No: ${receiptNumber}\n` +
      `Issue Date: ${issueDate}\n` +
      `Student Name: ${receipt.studentName}\n` +
      `Student Contact: ${receipt.studentContact}\n` +
      `Parent Contact: ${parentContactDisplay}\n` +
      `Address: ${studentAddress}\n` +
      `Fees Paid: Rs. ${receipt.feesPaid}/- ${formattedAmountWords}\n` +
      `Payment Mode: ${receipt.paymentMode}\n` +
      `Next Due Date: ${nextDueDate}\n` +
      `------------------------------------------\n` +
      `Plot No. 148, Ground Basement, Shrinanda Plaza, Cidco Waluj Mahanagar - 1, Chh. Sambhajinagar, MH 431136\n` +
      `Authorized Signature: Chanakya Abhyasika\n` +
      `_This is a computer-generated receipt. Payment implies acceptance of terms and conditions._`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/91${cleanMobile}?text=${encoded}`, "_blank");
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
          className="bg-white p-6 sm:p-10 font-sans text-slate-900 leading-normal select-text print:p-8"
        >
          {/* 1. Header with Calligraphic Logo */}
          <div className="text-center mb-3">
            {/* Logo Graphic */}
            <div className="inline-flex flex-col items-center justify-center mb-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl sm:text-3xl text-[#dc2626] tracking-tight font-serif drop-shadow-xs">
                  चाणक्य
                </span>
                {/* Sun burst rays icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-amber-500 fill-amber-500 inline-block animate-pulse"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-center -mt-1">
                <span className="font-black text-xl sm:text-2xl text-[#0f172a] tracking-tight font-serif">
                  अभ्यासिका
                </span>
                <span className="text-[8px] tracking-[0.25em] font-bold text-slate-400 uppercase -mt-0.5">
                  STANDERD
                </span>
              </div>
            </div>

            {/* Official Address */}
            <p className="text-[10px] sm:text-[11px] text-slate-700 font-medium max-w-xl mx-auto leading-relaxed border-t border-slate-200 pt-1.5 mt-1">
              Plot No. 148, Ground Basement, Shrinanda Plaza, Cidco Waluj Mahanagar - 1, Chh. Sambhajinagar, MH 431136
            </p>
          </div>

          {/* 2. Receipt Title */}
          <div className="text-center my-3">
            <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] tracking-wider uppercase border-b-2 border-[#1e3a8a] inline-block px-6 pb-0.5">
              FEES RECEIPT
            </h2>
          </div>

          {/* 3. Receipt No & Issue Date Bar */}
          <div className="flex items-center justify-between text-xs sm:text-[13px] font-bold text-slate-900 mb-2 px-0.5">
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
          <div className="border-2 border-slate-400 overflow-hidden mb-4">
            <table className="w-full text-left text-xs sm:text-[13px] border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-[32%] sm:w-[28%] font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Student Name
                  </td>
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5">
                    {receipt.studentName}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Contact (Student)
                  </td>
                  <td className="font-mono text-slate-800 p-2 sm:p-2.5">
                    {receipt.studentContact}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Contact (Parents)
                  </td>
                  <td className="font-mono text-slate-800 p-2 sm:p-2.5">
                    {parentContactDisplay}
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Address
                  </td>
                  <td className="text-slate-800 p-2 sm:p-2.5">
                    {studentAddress}
                  </td>
                </tr>

                <tr className="border-b border-slate-300 bg-slate-50/30">
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Fees Paid
                  </td>
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5">
                    <span>Rs. {receipt.feesPaid}/- </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 ml-1">
                      {formattedAmountWords}
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-300">
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Payment Mode
                  </td>
                  <td className="font-semibold text-slate-800 p-2 sm:p-2.5 capitalize">
                    {receipt.paymentMode || "Cash"}
                  </td>
                </tr>

                <tr>
                  <td className="font-bold text-slate-900 p-2 sm:p-2.5 border-r border-slate-300 bg-slate-50/50">
                    Next Due Date
                  </td>
                  <td className="font-mono font-bold text-slate-900 p-2 sm:p-2.5">
                    {nextDueDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. Terms & Conditions Separator */}
          <div className="border-t-2 border-red-500 mb-3" />

          {/* 6. Terms & Conditions (Word for word from PDF) */}
          <div className="text-[10px] sm:text-[11px] text-slate-800 space-y-1 leading-snug">
            <h4 className="font-bold text-xs sm:text-[12px] text-slate-900 mb-1.5 underline">
              Terms &amp; Conditions
            </h4>
            <ol className="list-decimal list-outside pl-4 space-y-1">
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

          {/* 7. Signature Block (Bottom Right) */}
          <div className="mt-6 flex justify-end">
            <div className="text-center w-48">
              {/* Authorized Signature SVG graphic */}
              <div className="h-10 flex items-center justify-center">
                <svg
                  viewBox="0 0 160 50"
                  className="w-36 h-10 text-slate-900 fill-none stroke-current"
                  style={{ strokeWidth: 1.8, strokeLinecap: "round" }}
                >
                  {/* Stylized 'Rohit' cursive signature path matching PDF */}
                  <path d="M15,35 C20,15 25,10 32,22 C37,30 42,32 46,24 C50,15 54,12 58,25 C62,35 68,36 75,25 C80,18 84,20 88,30 C95,20 102,15 110,24 C118,32 125,28 135,15" />
                  <path d="M28,8 L32,42" />
                  <path d="M20,38 Q75,48 145,28" />
                  <circle cx="112" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="138" cy="38" r="1" fill="currentColor" />
                  <circle cx="142" cy="40" r="1" fill="currentColor" />
                  <circle cx="146" cy="42" r="1" fill="currentColor" />
                </svg>
              </div>
              <p className="font-bold text-xs text-slate-900 mt-1">
                Authorized Signature
              </p>
              <p className="text-[11px] text-slate-700">
                Chanakya Abhyasika
              </p>
            </div>
          </div>

          {/* 8. Footer Note */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-center text-[9.5px] sm:text-[10px] text-slate-500 italic">
            This is a computer-generated receipt. Payment implies acceptance of the above terms and conditions.
          </div>
        </div>

        {/* Modal Bottom Action Bar (Hidden in Print) */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-98"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition active:scale-98"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-98"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Send on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
