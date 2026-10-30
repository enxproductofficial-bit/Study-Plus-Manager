"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wifi,
  Wind,
  Lock,
  Zap,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Calendar,
  Users,
  ArrowRight,
  BookOpen,
  Sparkles,
  QrCode,
  CreditCard,
  UserCheck,
} from "lucide-react";

interface PublicLibraryData {
  id: string;
  code: string;
  slug: string;
  name: string;
  tagline: string;
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openingHours: string;
  facilities: string[];
  branchId: string;
  branchName: string;
  totalSeats: number;
  vacantSeats: number;
  bookedSeats: number;
  reservedSeats: number;
  shifts: {
    id: string;
    name: string;
    shiftType: string;
    startTime: string;
    endTime: string;
    is24Hour: boolean;
  }[];
  feePlans: {
    id: string;
    name: string;
    amount: number;
    registrationFee: number;
    durationDays: number;
  }[];
}

export default function PublicLibraryWebsite({
  params,
}: {
  params: { slug: string };
}) {
  const [data, setData] = useState<PublicLibraryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Online Admission Modal / Form state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [enrollForm, setEnrollForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "UPSC / MPSC Civil Services",
    preferredShift: "Morning Shift (06:00 - 14:00)",
    guardianMobile: "",
  });
  const [enrollSubmitted, setEnrollSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/libraries/${params.slug}`);
        const json = await res.json();
        if (json.success) {
          setData(json.library);
          if (json.library.feePlans?.length > 0) {
            setSelectedPlan(json.library.feePlans[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load public library website", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [params.slug]);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const lib = data || {
    name: "StudyPlus Abhyasika",
    tagline: "Study • Focus • Grow - Complete Silent Reading Centre",
    code: "LIB-2026-001",
    slug: "studyplus-shivajinagar",
    address: "Plot 12, Shivaji Nagar, Near Modern College",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    contactPhone: "+91-9226860060",
    contactEmail: "contact@enterprenex.solutions",
    openingHours: "06:00 AM - 12:00 AM (24/7 Available)",
    facilities: ["High-Speed 5G Wi-Fi", "Quiet AC Zones", "Personal Lockers", "RO Water", "Power at Desks", "CCTV Security"],
    totalSeats: 48,
    vacantSeats: 34,
    bookedSeats: 12,
    reservedSeats: 2,
    shifts: [],
    feePlans: [],
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black shadow-md shadow-emerald-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">{lib.name}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  {lib.code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{lib.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="hidden sm:inline-flex rounded-xl border border-slate-800 bg-slate-800/50 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Student Login
            </Link>
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition"
            >
              Enroll Now
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Premier Study Centre & Abhyasika in {lib.city}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Focus on Your Dreams with Silent, Dedicated Study Space
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {lib.name} offers ergonomic seating, high-speed fiber internet, silent air-conditioned halls, and 24-hour shift options for students preparing for competitive exams.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Reserve Your Seat Online
                </button>
                <a
                  href={`tel:${lib.contactPhone}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  Call: {lib.contactPhone}
                </a>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Instant PVC ID Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>QR Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Online Payments</span>
                </div>
              </div>
            </div>

            {/* Live Seat Availability Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl shadow-emerald-950/30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      LIVE DESK AVAILABILITY
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Real-Time Desk Status</h3>
                  </div>
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 my-6 text-center">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                    <div className="text-2xl font-black text-emerald-400">{lib.vacantSeats}</div>
                    <div className="text-[11px] font-semibold text-emerald-300 mt-1">Available</div>
                  </div>
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5">
                    <div className="text-2xl font-black text-red-400">{lib.bookedSeats}</div>
                    <div className="text-[11px] font-semibold text-red-300 mt-1">Occupied</div>
                  </div>
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                    <div className="text-2xl font-black text-amber-400">{lib.reservedSeats}</div>
                    <div className="text-[11px] font-semibold text-amber-300 mt-1">Reserved</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Hall Capacity:</span>
                    <span className="font-semibold text-white">{lib.totalSeats} Desks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Opening Hours:</span>
                    <span className="font-semibold text-white">{lib.openingHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-emerald-400">{lib.city}, {lib.state}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="w-full mt-6 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Book Seat Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Amenities */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              PREMIUM INFRASTRUCTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Designed for Non-Stop Concentration
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "High-Speed Wi-Fi", icon: Wifi, desc: "Seamless 5G fiber connection" },
              { label: "Quiet AC Zones", icon: Wind, desc: "Silent, temperature-controlled" },
              { label: "Personal Lockers", icon: Lock, desc: "Secure storage for study books" },
              { label: "RO Water System", icon: Coffee, desc: "Pure filtered drinking water" },
              { label: "Desk Power Points", icon: Zap, desc: "Charging ports at every desk" },
              { label: "CCTV Surveillance", icon: ShieldCheck, desc: "24/7 security & recording" },
            ].map((fac, i) => {
              const Icon = fac.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">{fac.label}</h4>
                  <p className="mt-1 text-[10px] text-slate-400">{fac.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shift Timings & Pricing Plans */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              TRANSPARENT TARIFF
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Flexible Shifts & Membership Plans
            </h2>
            <p className="text-xs text-slate-400">
              Pick the shift that aligns with your study schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Morning Shift (AC)", time: "06:00 AM - 02:00 PM", price: "₹1,500", period: "/month", tag: "Early Bird" },
              { name: "Afternoon Shift (AC)", time: "02:00 PM - 10:00 PM", price: "₹1,400", period: "/month", tag: "Afternoon" },
              { name: "Evening Shift (AC)", time: "06:00 PM - 11:00 PM", price: "₹1,200", period: "/month", tag: "Working Execs" },
              { name: "24-Hour Full Access", time: "Round the Clock Access", price: "₹2,800", period: "/month", tag: "Dedicated Desk", popular: true },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border transition flex flex-col justify-between ${
                  plan.popular
                    ? "border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 shadow-xl shadow-emerald-950/30"
                    : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{plan.tag}</span>
                    {plan.popular && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">{plan.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{plan.time}</span>
                  </div>

                  <div className="mt-5 flex items-baseline gap-1 border-t border-slate-800 pt-4">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Reserved physical desk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Dedicated charging socket</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>High-speed Wi-Fi access</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsEnrollModalOpen(true);
                  }}
                  className={`mt-6 w-full rounded-2xl py-2.5 text-xs font-bold transition ${
                    plan.popular
                      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address & Contact Details */}
      <section className="py-16 bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                VISIT THE STUDY CENTRE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Location & Opening Hours
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Walk in for a 1-day demo session and tour our study centre. Front-desk staff available daily for admissions and seat selection.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">{lib.address}</div>
                    <div className="text-slate-400">{lib.city}, {lib.state} - {lib.pincode}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <a href={`tel:${lib.contactPhone}`} className="font-semibold text-white hover:text-emerald-400">
                      {lib.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <a href={`mailto:${lib.contactEmail}`} className="font-semibold text-white hover:text-emerald-400">
                      {lib.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">{lib.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification / Trust Badge */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">GranthSetu Verified Centre</h4>
                  <p className="text-[11px] text-slate-400">Powered by Enterprenex Solution Pvt. Ltd.</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Admissions, attendance, and online fee payments are securely processed through GranthSetu with instant digital ID cards and dual WhatsApp notifications.
              </p>

              <div className="pt-2">
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Student Self-Service Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Modal ("Enroll Now") */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setIsEnrollModalOpen(false);
                setEnrollSubmitted(false);
              }}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {!enrollSubmitted ? (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                    ONLINE ADMISSION
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Enroll at {lib.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fill the form below to reserve your seat. Front-desk staff will review and allot your desk.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student full name"
                    value={enrollForm.fullName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, fullName: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Mobile Number (OTP)</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={enrollForm.mobile}
                      onChange={(e) => setEnrollForm({ ...enrollForm, mobile: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Parent / Guardian Mobile</label>
                    <input
                      type="tel"
                      required
                      placeholder="Parent mobile number"
                      value={enrollForm.guardianMobile}
                      onChange={(e) => setEnrollForm({ ...enrollForm, guardianMobile: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Course / Exam Preparing For</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UPSC, MPSC, NEET, CA, Banking"
                    value={enrollForm.course}
                    onChange={(e) => setEnrollForm({ ...enrollForm, course: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Preferred Shift</label>
                  <select
                    value={enrollForm.preferredShift}
                    onChange={(e) => setEnrollForm({ ...enrollForm, preferredShift: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 AM - 02:00 PM)</option>
                    <option value="Afternoon Shift (14:00 - 22:00)">Afternoon Shift (02:00 PM - 10:00 PM)</option>
                    <option value="Evening Shift (18:00 - 23:00)">Evening Shift (06:00 PM - 11:00 PM)</option>
                    <option value="24-Hour Full Access">24-Hour Full Day Access</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400">
                  <div className="font-semibold text-white mb-1">Aadhaar eKYC & Consent Notice:</div>
                  Identity verification follows UIDAI guidelines. Strictly last 4 digits stored. Confirmation SMS will be sent to both you and your parent.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
                >
                  Submit Enrollment Request
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Enrollment Request Received!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{enrollForm.fullName}</span>. Your application for <span className="text-emerald-400 font-semibold">{enrollForm.preferredShift}</span> has been forwarded to the library administration.
                </p>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                  A dual notification has been queued for <span className="font-mono text-emerald-400">{enrollForm.mobile}</span> and guardian number.
                </div>
                <button
                  onClick={() => {
                    setIsEnrollModalOpen(false);
                    setEnrollSubmitted(false);
                  }}
                  className="rounded-2xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div>{lib.name} • Registered under GranthSetu Abhyasika Management Platform</div>
        <div className="mt-1 text-[11px] text-slate-600">
          Powered by Enterprenex Solution Pvt. Ltd. • All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
