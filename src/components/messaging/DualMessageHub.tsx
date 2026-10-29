"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  CheckCheck,
  Clock,
} from "lucide-react";

interface DualMessageLog {
  id: string;
  eventType: "ADMISSION_CONFIRMATION" | "FEES_DUE" | "FEES_PAID";
  studentName: string;
  studentMobile: string;
  parentMobile: string;
  channel: "WHATSAPP" | "SMS_FALLBACK";
  studentStatus: "DELIVERED" | "SENT" | "FAILED";
  parentStatus: "DELIVERED" | "SENT" | "FAILED";
  contentSummary: string;
  sentAt: string;
}

const mockMessageLogs: DualMessageLog[] = [
  {
    id: "m1",
    eventType: "FEES_PAID",
    studentName: "Aditya Patil",
    studentMobile: "+91 9822114455",
    parentMobile: "+91 9422001122",
    channel: "WHATSAPP",
    studentStatus: "DELIVERED",
    parentStatus: "DELIVERED",
    contentSummary: "Receipt GS-PUN-0082: Received ₹1,800 for Monthly Morning AC. Balance: ₹0. View PDF link.",
    sentAt: "Today, 10:14 AM",
  },
  {
    id: "m2",
    eventType: "FEES_DUE",
    studentName: "Siddharth Rao",
    studentMobile: "+91 9890123456",
    parentMobile: "+91 9423123456",
    channel: "WHATSAPP",
    studentStatus: "DELIVERED",
    parentStatus: "DELIVERED",
    contentSummary: "Fee Reminder: ₹1,400 due for Seat S-22. Pay online via Razorpay link.",
    sentAt: "Yesterday, 09:00 AM",
  },
  {
    id: "m3",
    eventType: "ADMISSION_CONFIRMATION",
    studentName: "Pooja Shinde",
    studentMobile: "+91 9766223344",
    parentMobile: "+91 9822334455",
    channel: "SMS_FALLBACK",
    studentStatus: "DELIVERED",
    parentStatus: "DELIVERED",
    contentSummary: "Welcome to GranthSetu! Seat S-14 allotted. Your QR ID card link: https://granthsetu.in/id/s14",
    sentAt: "24 Oct 2026, 04:30 PM",
  },
];

export const DualMessageHub: React.FC = () => {
  const [logs] = useState<DualMessageLog[]>(mockMessageLogs);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Dual Dispatch Success</span>
            <CheckCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">98.4%</div>
          <span className="text-xs text-slate-400">Delivered to both student and parent</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Primary Channel</span>
            <MessageSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            WhatsApp Business API
          </div>
          <span className="text-xs text-slate-400">Utility Templates Approved</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">SMS Fallback (DLT)</span>
            <Smartphone className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            MSG91 / Fast2SMS
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            DLT Headers Configured
          </span>
        </div>
      </div>

      {/* Message Matrix Log */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Dual Notification Delivery Audit</h3>
          <p className="text-xs text-slate-500">
            Mandatory policy: Every message triggers simultaneously for Student and Parent
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="p-5 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      log.eventType === "FEES_PAID"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : log.eventType === "FEES_DUE"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                    }`}
                  >
                    {log.eventType.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {log.studentName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{log.sentAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                &ldquo;{log.contentSummary}&rdquo;
              </p>

              {/* Status for Student and Parent */}
              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Student ({log.studentMobile}):</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCheck className="h-3.5 w-3.5" />
                    Delivered ({log.channel})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Parent ({log.parentMobile}):</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCheck className="h-3.5 w-3.5" />
                    Delivered ({log.channel})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

