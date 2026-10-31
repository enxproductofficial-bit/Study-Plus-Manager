"use client";

import React, { useState, useEffect } from "react";
import { 
  Armchair, 
  Zap, 
  Lock, 
  User, 
  Phone, 
  Clock, 
  Calendar, 
  Filter, 
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Loader2,
  Check
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Shift {
  id: string;
  name: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  is24Hour: boolean;
}

interface SeatItem {
  id: string;
  seatNumber: string;
  section: string;
  status: "VACANT" | "BOOKED" | "RESERVED" | "MAINTENANCE";
  hasLocker: boolean;
  hasChargingPoint: boolean;
  currentStudent?: {
    name: string;
    mobile: string;
    regNo?: string;
    shiftName: string;
    validTill: string;
  };
}

export const SeatMap: React.FC = () => {
  const { t } = useTranslation();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Allotment Modal State
  const [isAllotting, setIsAllotting] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("");
  const [studentMobile, setStudentMobile] = useState<string>("");
  const [allottingLoading, setAllottingLoading] = useState<boolean>(false);
  const [allotSuccess, setAllotSuccess] = useState<string | null>(null);
  const [allotError, setAllotError] = useState<string | null>(null);

  // Fetch live seats & shifts from Neon PostgreSQL
  const fetchLiveSeats = async (shiftId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = shiftId ? `/api/seats?shiftId=${shiftId}` : "/api/seats";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load seats from database");

      const data = await res.json();
      setShifts(data.shifts || []);
      setSeats(data.seats || []);
      if (!selectedShiftId && data.activeShiftId) {
        setSelectedShiftId(data.activeShiftId);
      }
      // Refresh inspector if a seat was already selected
      if (selectedSeat) {
        const updated = (data.seats || []).find((s: SeatItem) => s.id === selectedSeat.id);
        if (updated) setSelectedSeat(updated);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to Neon PostgreSQL. Please check internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSeats(selectedShiftId);
  }, [selectedShiftId]);

  // Handle Quick Seat Allotment
  const handleAllotSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat || !selectedShiftId) return;

    setAllottingLoading(true);
    setAllotError(null);
    setAllotSuccess(null);

    try {
      const res = await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          shiftId: selectedShiftId,
          studentName,
          studentMobile,
          durationDays: 30,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to allot seat");
      }

      setAllotSuccess(data.message);
      setStudentName("");
      setStudentMobile("");
      setIsAllotting(false);
      // Refresh seat matrix from Neon
      await fetchLiveSeats(selectedShiftId);
    } catch (err: any) {
      setAllotError(err.message);
    } finally {
      setAllottingLoading(false);
    }
  };

  const filteredSeats = seats.filter((s) => {
    if (selectedSection === "ALL") return true;
    return s.section.includes(selectedSection);
  });

  const vacantCount = seats.filter((s) => s.status === "VACANT").length;
  const bookedCount = seats.filter((s) => s.status === "BOOKED").length;
  const reservedCount = seats.filter((s) => s.status === "RESERVED").length;

  return (
    <div className="space-y-6">
      {/* Toast Confirmation */}
      {allotSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{allotSuccess}</span>
        </div>
      )}

      {/* Top Banner & Shift Filter */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("nav_seats")}
              </h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("live_sync")}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time occupancy across physical study hall desks. Verified live database synchronization.
            </p>
          </div>

          {/* Legend Counters */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80" />
              <span className="text-slate-600 dark:text-slate-300">Vacant ({vacantCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md bg-rose-500 text-white" />
              <span className="text-slate-600 dark:text-slate-300">Booked ({bookedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md bg-amber-400 text-amber-950" />
              <span className="text-slate-600 dark:text-slate-300">Reserved ({reservedCount})</span>
            </div>
            <button
              onClick={() => fetchLiveSeats(selectedShiftId)}
              title="Refresh from Neon"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Shift Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Select Shift:</span>
            <div className="flex flex-wrap gap-1.5">
              {shifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => setSelectedShiftId(shift.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedShiftId === shift.id
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {shift.name} ({shift.startTime} - {shift.endTime})
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Floors (48 Seats)</option>
              <option value="Ground Floor">Ground Floor (Quiet AC Zone)</option>
              <option value="First Floor">First Floor (General AC Zone)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid + Inspector Drawer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: 48 Seat Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Interactive Floor Grid ({filteredSeats.length} Seats Displayed)
            </h3>
            <span className="text-xs text-slate-400">Click any seat to inspect or allot</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs font-semibold">Loading real seats from Neon PostgreSQL...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {filteredSeats.map((seat) => {
                const isSelected = selectedSeat?.id === seat.id;
                let bgClass = "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300";

                if (seat.status === "BOOKED") {
                  bgClass = "bg-rose-500 border-rose-600 text-white shadow-sm hover:bg-rose-600";
                } else if (seat.status === "RESERVED") {
                  bgClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-500";
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => {
                      setSelectedSeat(seat);
                      setIsAllotting(false);
                      setAllotError(null);
                    }}
                    className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all transform active:scale-95 ${bgClass} ${
                      isSelected ? "ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900" : ""
                    }`}
                  >
                    <Armchair className="h-5 w-5 mb-1" />
                    <span className="text-xs font-bold font-mono">{seat.seatNumber}</span>

                    <div className="mt-1 flex items-center gap-1 opacity-75">
                      {seat.hasChargingPoint && <Zap className="h-2.5 w-2.5" />}
                      {seat.hasLocker && <Lock className="h-2.5 w-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Seat Inspector & Allotment Box */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
            Seat Inspector
          </h3>

          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-lg shadow-sm">
                    {selectedSeat.seatNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Desk {selectedSeat.seatNumber}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {selectedSeat.section}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    selectedSeat.status === "VACANT"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                  }`}
                >
                  {selectedSeat.status}
                </span>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Power: Yes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-blue-500" />
                  <span>Locker: {selectedSeat.hasLocker ? "Included" : "None"}</span>
                </div>
              </div>

              {/* Occupant Details if Booked */}
              {selectedSeat.currentStudent ? (
                <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Occupant
                  </span>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {selectedSeat.currentStudent.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedSeat.currentStudent.mobile}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedSeat.currentStudent.shiftName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Valid Till: {selectedSeat.currentStudent.validTill}</span>
                  </div>
                </div>
              ) : (
                /* Vacant Actions / Direct Desk Allotment */
                <div className="space-y-3">
                  {!isAllotting ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center space-y-3 dark:border-slate-800">
                      <Armchair className="h-7 w-7 mx-auto text-emerald-500" />
                      <p className="text-xs text-slate-500">
                        Desk is available for this shift. Click below to allot immediately to a student.
                      </p>
                      <button
                        onClick={() => setIsAllotting(true)}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                      >
                        Allot Desk {selectedSeat.seatNumber}
                      </button>
                    </div>
                  ) : (
                    /* Allotment Form */
                    <form onSubmit={handleAllotSeat} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3 dark:border-blue-900/40 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                          Allotting {selectedSeat.seatNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAllotting(false)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>

                      {allotError && (
                        <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 dark:bg-rose-950/50">
                          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{allotError}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Student Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Ramesh Kulkarni"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Student Mobile Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="9876543210"
                          value={studentMobile}
                          onChange={(e) => setStudentMobile(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={allottingLoading}
                        className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {allottingLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Recording in Neon...
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Confirm Allotment
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Armchair className="h-10 w-10 mb-2 stroke-[1.5]" />
              <p className="text-xs">Select any desk on the floor grid to inspect details or allot.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
