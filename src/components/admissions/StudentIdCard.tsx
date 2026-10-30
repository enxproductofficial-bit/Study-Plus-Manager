"use client";

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { Printer, Download, Sparkles, ShieldCheck, CheckCircle } from "lucide-react";

export interface IdCardData {
  regNo: string;
  name: string;
  mobile: string;
  course: string;
  seatNumber: string;
  shiftName: string;
  shiftTiming: string;
  qrCodeToken: string;
  validTill: string;
  guardianName?: string;
  guardianMobile?: string;
  bloodGroup?: string;
}

interface StudentIdCardProps {
  cardData: IdCardData;
  onClose?: () => void;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ cardData, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code data URL from unique token & verification link
    const qrPayload = JSON.stringify({
      v: "1",
      app: "GranthSetu",
      regNo: cardData.regNo,
      token: cardData.qrCodeToken,
      seat: cardData.seatNumber,
      shift: cardData.shiftName,
    });

    QRCode.toDataURL(qrPayload, {
      width: 256,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code error:", err));
  }, [cardData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Official Student ID Card (CR80 Standard)
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              Verified eKYC
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Compliant with Enterprenex CR-01 & SRS Module 09. Ready for CR80 PVC card printer or thermal badge.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* ID Cards Layout (Front & Back) */}
      <div ref={printRef} className="flex flex-col items-center justify-center gap-6 sm:flex-row print:m-0 print:p-0">
        {/* FRONT SIDE (CR80 Dimensions: ~85.6mm x 54mm) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md print:shadow-none print:border-black w-[340px] h-[216px] text-slate-900 select-none">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-3.5 py-2 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="font-extrabold text-sm tracking-tight">GranthSetu</span>
                </div>
                <p className="text-[8px] font-medium tracking-wide text-blue-200">
                  ABHYASIKA MANAGEMENT SYSTEM
                </p>
              </div>
              <div className="text-right">
                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-slate-900">
                  STUDENT ID
                </span>
                <p className="text-[8px] font-mono font-bold text-slate-200 mt-0.5">
                  {cardData.regNo}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex flex-1 items-center gap-3 p-3">
            {/* Student Avatar / Photo */}
            <div className="relative flex flex-col items-center">
              <div className="flex h-20 w-16 flex-col items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-100 text-slate-400 overflow-hidden shadow-inner">
                <span className="text-xl font-black text-slate-700">
                  {cardData.name.charAt(0)}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase mt-0.5">Photo</span>
              </div>
              <div className="mt-1 flex items-center justify-center rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-black text-blue-800">
                DESK {cardData.seatNumber}
              </div>
            </div>

            {/* Information Grid */}
            <div className="flex-1 space-y-1 text-left">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                  {cardData.name}
                </h4>
                <p className="text-[10px] font-semibold text-blue-600">
                  {cardData.course}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-slate-600 border-t border-slate-100 pt-1">
                <div>
                  <span className="text-[8px] text-slate-400 block">Shift</span>
                  <span className="font-bold text-slate-800">{cardData.shiftName}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block">Timings</span>
                  <span className="font-bold text-slate-800">{cardData.shiftTiming}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block">Student Mob</span>
                  <span className="font-mono font-bold text-slate-800">{cardData.mobile}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block">Valid Till</span>
                  <span className="font-mono font-bold text-emerald-700">{cardData.validTill}</span>
                </div>
              </div>
            </div>

            {/* Scannable Attendance QR */}
            <div className="flex flex-col items-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Student QR Token"
                  className="h-16 w-16 rounded border border-slate-200 bg-white p-0.5"
                />
              ) : (
                <div className="h-16 w-16 animate-pulse rounded bg-slate-200" />
              )}
              <span className="text-[7px] font-mono font-bold text-slate-400 mt-0.5">Scan Attendance</span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-1 text-[8px] text-slate-500 font-semibold">
            <span>Branch: Shivaji Nagar</span>
            <span className="text-blue-700 font-bold">Powered by ENTERPRENEX SOLUTION</span>
          </div>
        </div>

        {/* BACK SIDE (CR80 Rules, Emergency & Center Details) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md print:shadow-none print:border-black w-[340px] h-[216px] text-slate-900 select-none">
          <div className="bg-slate-900 px-3.5 py-2 text-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs tracking-wider uppercase text-amber-400">
                Study Room Regulations
              </span>
              <span className="text-[8px] text-slate-300">Helpline: +91-9226860060</span>
            </div>
          </div>

          <div className="flex-1 p-3 text-left space-y-1.5 text-[8.5px] text-slate-600">
            <div className="flex items-start gap-1">
              <span className="text-blue-600 font-bold">1.</span>
              <span>This card is mandatory for counter QR check-in & desk occupancy verification.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Maintain pin-drop silence. Phone calls strictly outside the reading hall.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Power sockets are dedicated exclusively to laptops and study tablets.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Non-transferable. Loss of card must be reported to the front desk immediately.</span>
            </div>

            {/* Parent / Emergency Contact Box */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-[8px] mt-1">
              <span className="font-bold text-slate-700 block">Parent / Emergency Contact:</span>
              <div className="flex justify-between items-center text-slate-600 mt-0.5">
                <span>{cardData.guardianName || "Guardian"}</span>
                <span className="font-mono font-bold text-slate-800">{cardData.guardianMobile || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Attribution */}
          <div className="border-t border-slate-200 bg-slate-50 px-3 py-1 flex items-center justify-between text-[7px] text-slate-500">
            <span>Plot 148, Shrinand Plaza, CIDCO Waluj Mahanagar 1, Chh. Sambhajinagar</span>
            <span className="font-bold text-slate-700">Authorised Signatory</span>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-3 text-center text-xs text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200 print:hidden">
        <p className="font-medium">
          💡 <b>Printing Tip:</b> Click <b>&quot;Print / Save PDF&quot;</b> and select standard <b>CR80 PVC Card</b> or <b>Letter/A4</b> paper with margins set to &quot;None&quot; for high-resolution 300 DPI printing.
        </p>
      </div>
    </div>
  );
};

