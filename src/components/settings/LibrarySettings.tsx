"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Clock,
  Layers,
  IndianRupee,
  ShieldCheck,
  Bell,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Save,
  Plus,
  Phone,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export const LibrarySettings: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<
    "profile" | "shifts" | "plans" | "staff" | "payments" | "notifications" | "appearance"
  >("profile");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");

  // Form State
  const [profile, setProfile] = useState({
    name: "StudyPlus Abhyasika",
    tagline: "Study • Focus • Grow - Premium Reading Room",
    phone: "+91-9226860060",
    email: "contact@enterprenex.solutions",
    address: "Plot 12, Shivaji Nagar, Near Modern College",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    openingHours: "06:00 AM - 12:00 AM (24/7 Available)",
    totalSeats: 48,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleApplyTheme = (mode: "light" | "dark" | "system") => {
    setThemeMode(mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            Study Centre Settings & Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your study centre branding, shifts, fee tariffs, staff permissions, and gateway webhooks.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {t("saved_successfully")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section Navigation */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: "profile", label: "Centre Profile & Contact", icon: Building2 },
            { id: "shifts", label: "Shifts & Operating Hours", icon: Clock },
            { id: "plans", label: "Tariff & Membership Plans", icon: IndianRupee },
            { id: "staff", label: "Staff Accounts (RBAC)", icon: UserCheck },
            { id: "payments", label: "Razorpay Gateway Webhooks", icon: CreditCard },
            { id: "notifications", label: "Dual WhatsApp & SMS", icon: Bell },
            { id: "appearance", label: "Theme & Dark Mode", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section Content */}
        <div className="lg:col-span-9">
          {activeSection === "profile" && (
            <form onSubmit={handleSave} className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Study Centre Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Study Centre Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Helpline / Contact Phone</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Support Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-slate-700">Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Pincode</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                >
                  <Save className="h-4 w-4" />
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {activeSection === "shifts" && (
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Shift Timings & Allocation Rules</h3>
                <span className="text-xs text-indigo-600 font-semibold">4 Shifts Configured</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Morning Shift (AC)", timing: "06:00 AM - 02:00 PM", type: "MORNING", is24Hour: false },
                  { name: "Afternoon Shift (AC)", timing: "02:00 PM - 10:00 PM", type: "AFTERNOON", is24Hour: false },
                  { name: "Evening Shift (AC)", timing: "06:00 PM - 11:00 PM", type: "EVENING", is24Hour: false },
                  { name: "24-Hour Full Access", timing: "00:00 - 23:59 (Round the Clock)", type: "FULL_DAY_24HR", is24Hour: true },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{s.timing}</div>
                    </div>
                    <div>
                      {s.is24Hour ? (
                        <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                          Locks All Other Shifts
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Active Shift
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "plans" && (
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Fee Plans & Monthly Charges</h3>
                <span className="text-xs text-indigo-600 font-semibold">Standard Plans Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: "Monthly Morning Shift (AC)", fee: "₹1,500/mo", reg: "₹200", duration: "30 Days" },
                  { name: "Monthly Afternoon Shift (AC)", fee: "₹1,400/mo", reg: "₹200", duration: "30 Days" },
                  { name: "Monthly Evening Shift (AC)", fee: "₹1,200/mo", reg: "₹200", duration: "30 Days" },
                  { name: "Monthly 24-Hour Full Access", fee: "₹2,800/mo", reg: "₹200", duration: "30 Days" },
                ].map((p, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-lg font-black text-indigo-700">{p.fee}</div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Registration: {p.reg}</span>
                      <span>Duration: {p.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "staff" && (
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Staff Accounts & Permissions (RBAC)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Staff have zero access to Owner P&L or total revenue</p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700">
                  <Plus className="h-3.5 w-3.5" />
                  Add Staff Member
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">Desk Officer (Staff)</div>
                  <div className="text-slate-500">Mobile: 9876543211 • Branch: Main Branch - Shivaji Nagar</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    Front-Desk Operator
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "payments" && (
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Company Razorpay Webhook Configuration</h3>
                <p className="text-xs text-slate-400 mt-0.5">Webhook auto-reconciliation & cryptographic signature verification</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <span className="font-bold text-slate-800">Webhook Authority (FR-PG-2):</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    Student fees are marked paid solely upon receiving an authentic HMAC SHA256 signature from Razorpay. Direct client-side payment success redirects are never trusted.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <span className="font-bold text-slate-800">Sequential Receipt Numbering (FR-RC-1):</span>
                  <p className="text-slate-600 mt-0.5">
                    Branch prefix: <span className="font-mono font-bold text-indigo-600">GS-PUN-XXXX</span> (Immutable & strictly sequential).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dual WhatsApp & SMS Dispatch Rules</h3>
                <p className="text-xs text-slate-400 mt-0.5">CR-01 Mandate: Simultaneous routing to both Student and Parent numbers</p>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  "Admission Confirmation & Welcome Kit link",
                  "Fee Due Reminder (Dispatched 3 days prior to due date)",
                  "Instant Payment Capture & PDF Receipt Link",
                  "Seat Renewal Reminder (Dispatched 3 days prior to seat expiry)",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Theme & Display Settings (Photo 3 Item VI)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manually select between Light Mode and Dark Mode</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyTheme("light")}
                  className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all ${
                    themeMode === "light"
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-950"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">☀ Light Mode</span>
                  <span className="text-slate-500 text-[11px]">Clean white cards, soft borders, and clear readable typography.</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyTheme("dark")}
                  className={`flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all ${
                    themeMode === "dark"
                      ? "border-indigo-600 bg-slate-800 text-white"
                      : "border-slate-200 bg-slate-900 text-white hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">☾ Dark Navy Mode</span>
                  <span className="text-slate-400 text-[11px]">Dark background with deep slate navy cards for reduced eye strain.</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Theme preference is remembered in your browser.</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to log out?")) {
                      window.location.href = "/";
                    }
                  }}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  {t("sign_out")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

