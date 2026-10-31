"use client";

import React, { useState } from "react";
import {
  Users2,
  Plus,
  Phone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  UserCheck,
} from "lucide-react";

interface EnquiryItem {
  id: string;
  name: string;
  mobile: string;
  course: string;
  preferredShift: string;
  status: "NEW" | "FOLLOW_UP" | "ADMISSION_PENDING" | "APPROVED" | "CONVERTED";
  date: string;
  notes: string;
}

interface EnquiryCrmProps {
  onConvertToAdmission?: (enquiry: EnquiryItem) => void;
}

export const EnquiryCrm: React.FC<EnquiryCrmProps> = ({ onConvertToAdmission }) => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([
    {
      id: "enq-1",
      name: "Rohit Shinde",
      mobile: "9822114455",
      course: "MPSC Rajyaseva",
      preferredShift: "Morning Shift (06:00 - 14:00)",
      status: "NEW",
      date: new Date().toISOString(),
      notes: "Walked in inquiring about AC quiet floor and locker charges.",
    },
    {
      id: "enq-2",
      name: "Pooja Jadhav",
      mobile: "9422336677",
      course: "UPSC Civil Services",
      preferredShift: "24-Hour Full Day Access",
      status: "FOLLOW_UP",
      date: new Date(Date.now() - 86400000).toISOString(),
      notes: "Follow-up required on Saturday regarding seat reservation.",
    },
    {
      id: "enq-3",
      name: "Akash Wagh",
      mobile: "9766554433",
      course: "CA Final",
      preferredShift: "Evening Shift (18:00 - 23:00)",
      status: "ADMISSION_PENDING",
      date: new Date(Date.now() - 172800000).toISOString(),
      notes: "Document submission pending. Ready to pay fees.",
    },
    {
      id: "enq-4",
      name: "Sneha Kulkarni",
      mobile: "9158443322",
      course: "Banking PO",
      preferredShift: "Afternoon Shift (14:00 - 22:00)",
      status: "CONVERTED",
      date: new Date(Date.now() - 259200000).toISOString(),
      notes: "Converted to active student on Seat S-14.",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formCourse, setFormCourse] = useState("UPSC / MPSC");
  const [formShift, setFormShift] = useState("Morning Shift (06:00 - 14:00)");
  const [formNotes, setFormNotes] = useState("");

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMobile) return;

    const newEnq: EnquiryItem = {
      id: `enq-${Date.now()}`,
      name: formName,
      mobile: formMobile,
      course: formCourse,
      preferredShift: formShift,
      status: "NEW",
      date: new Date().toISOString(),
      notes: formNotes || "Walk-in enquiry recorded.",
    };

    setEnquiries([newEnq, ...enquiries]);
    setIsAddModalOpen(false);
    setFormName("");
    setFormMobile("");
    setFormNotes("");
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const filtered = activeTab === "ALL" ? enquiries : enquiries.filter((e) => e.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users2 className="h-5 w-5 text-indigo-600" />
            Admissions & Walk-In Enquiries (CRM)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track student leads, schedule follow-ups, and convert enquiries to active admissions in 1 click.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          Record New Walk-In
        </button>
      </div>

      {/* Stage Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: "ALL", label: "Total Enquiries", count: enquiries.length, color: "text-slate-800" },
          { id: "NEW", label: "New Leads", count: enquiries.filter((e) => e.status === "NEW").length, color: "text-blue-600" },
          { id: "FOLLOW_UP", label: "Follow-Up Required", count: enquiries.filter((e) => e.status === "FOLLOW_UP").length, color: "text-amber-600" },
          { id: "ADMISSION_PENDING", label: "Admission Pending", count: enquiries.filter((e) => e.status === "ADMISSION_PENDING").length, color: "text-purple-600" },
          { id: "CONVERTED", label: "Converted", count: enquiries.filter((e) => e.status === "CONVERTED").length, color: "text-emerald-600" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl p-4 text-left border transition ${
              activeTab === tab.id
                ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                : "bg-white border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-500 block">{tab.label}</span>
            <span className={`text-2xl font-black ${tab.color} mt-1 block`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Enquiries Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((enq) => (
          <div
            key={enq.id}
            className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{enq.name}</h4>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <a href={`tel:${enq.mobile}`} className="hover:text-indigo-600 font-medium">
                    {enq.mobile}
                  </a>
                </div>
              </div>

              <select
                value={enq.status}
                onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 focus:outline-none"
              >
                <option value="NEW">New Lead</option>
                <option value="FOLLOW_UP">Follow-Up Required</option>
                <option value="ADMISSION_PENDING">Admission Pending</option>
                <option value="CONVERTED">Converted to Admission</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-slate-400">Target Exam:</span>
                <div className="font-semibold text-slate-800">{enq.course}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-slate-400">Preferred Shift:</span>
                <div className="font-semibold text-indigo-700">{enq.preferredShift}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 italic">
              "{enq.notes}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-400">
                Logged {new Date(enq.date).toLocaleDateString()}
              </span>

              {onConvertToAdmission && enq.status !== "CONVERTED" && (
                <button
                  onClick={() => onConvertToAdmission(enq)}
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Convert to Admission</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
            No walk-in enquiries found for this stage.
          </div>
        )}
      </div>

      {/* Record New Walk-In Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Record Walk-In Student Enquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add walk-in lead details for follow-up and admission conversion.
            </p>

            <form onSubmit={handleCreateEnquiry} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Deshmukh"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Course / Exam</label>
                  <input
                    type="text"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Preferred Shift</label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-2.5 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Morning Shift (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Afternoon Shift (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
                    <option value="Evening Shift (18:00 - 23:00)">Evening (18:00 - 23:00)</option>
                    <option value="24-Hour Full Access">24-Hour Full Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Remarks / Follow-Up Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Student requested 1-day demo on Ground Floor AC"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

