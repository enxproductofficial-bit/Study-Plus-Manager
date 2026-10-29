"use client";

import React, { useState } from "react";
import { 
  Armchair, 
  Zap, 
  Lock, 
  User, 
  Phone, 
  Clock, 
  Calendar, 
  Filter, 
  CheckCircle2 
} from "lucide-react";
import { SeatInfo, SeatStatus, ShiftInfo } from "@/types";

const mockShifts: ShiftInfo[] = [
  { id: "s1", name: "Morning Shift", type: "MORNING", startTime: "06:00", endTime: "14:00" },
  { id: "s2", name: "Afternoon Shift", type: "AFTERNOON", startTime: "14:00", endTime: "22:00" },
  { id: "s3", name: "Evening Shift", type: "EVENING", startTime: "18:00", endTime: "23:00" },
  { id: "s4", name: "24-Hour Full Day", type: "FULL_DAY_24HR", startTime: "00:00", endTime: "23:59", is24Hour: true },
];

// Generate 48 mock seats across sections
const initialSeats: SeatInfo[] = Array.from({ length: 48 }, (_, i) => {
  const seatNum = `S-${String(i + 1).padStart(2, "0")}`;
  const isBooked = [2, 5, 8, 9, 14, 18, 22, 27, 30, 35, 41].includes(i + 1);
  const isReserved = [4, 12, 33].includes(i + 1);
  
  let status: SeatStatus = "VACANT";
  if (isBooked) status = "BOOKED";
  if (isReserved) status = "RESERVED";

  return {
    id: `seat-${i + 1}`,
    seatNumber: seatNum,
    section: i < 24 ? "Ground Floor (AC - Quiet Zone)" : "First Floor (AC - General)",
    status,
    hasLocker: i % 3 === 0,
    hasChargingPoint: true,
    currentStudent: isBooked ? {
      name: ["Rohan Sharma", "Pooja Patil", "Amit Deshmukh", "Snehal Kulkarni", "Kunal Shinde"][i % 5],
      mobile: `+91 982${String(1000000 + i * 12345).slice(0, 7)}`,
      shiftName: "Morning Shift (06:00 - 14:00)",
      validTill: "15 Nov 2026",
      dueAmount: (i % 2 === 0) ? 0 : 650,
    } : undefined,
  };
});

export const SeatMap: React.FC = () => {
  const [selectedShift, setSelectedShift] = useState<string>("s1");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);
  const [seats] = useState<SeatInfo[]>(initialSeats);

  const filteredSeats = seats.filter((s) => {
    if (selectedSection === "ALL") return true;
    return s.section.includes(selectedSection);
  });

  const vacantCount = seats.filter((s) => s.status === "VACANT").length;
  const bookedCount = seats.filter((s) => s.status === "BOOKED").length;
  const reservedCount = seats.filter((s) => s.status === "RESERVED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Live Seat Matrix & Allocation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time seat occupancy with double-booking prevention rule
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md border border-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 dark:border-emerald-700" />
              <span className="text-slate-600 dark:text-slate-300">Vacant ({vacantCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md border border-rose-300 bg-rose-500 text-white" />
              <span className="text-slate-600 dark:text-slate-300">Occupied ({bookedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-md border border-amber-300 bg-amber-400" />
              <span className="text-slate-600 dark:text-slate-300">Reserved ({reservedCount})</span>
            </div>
          </div>
        </div>

        {/* Filter bar: Shifts & Sections */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Shift:</span>
            <div className="flex flex-wrap gap-1.5">
              {mockShifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => setSelectedShift(shift.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedShift === shift.id
                      ? "bg-indigo-600 text-white shadow-sm"
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
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Sections</option>
              <option value="Ground Floor">Ground Floor (Quiet Zone)</option>
              <option value="First Floor">First Floor (General)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid + Seat Inspector Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Seats Grid */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Interactive Floor Layout
            </h3>
            <span className="text-xs text-slate-400">Click any seat to view details / allot</span>
          </div>

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
                  onClick={() => setSelectedSeat(seat)}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all transform active:scale-95 ${bgClass} ${
                    isSelected ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                  }`}
                >
                  <Armchair className="h-5 w-5 mb-1" />
                  <span className="text-xs font-bold font-mono">{seat.seatNumber}</span>
                  
                  {/* Indicators for Locker / Charging point */}
                  <div className="mt-1 flex items-center gap-1 opacity-80">
                    {seat.hasChargingPoint && <Zap className="h-2.5 w-2.5" />}
                    {seat.hasLocker && <Lock className="h-2.5 w-2.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Seat Details / Quick Action Drawer */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Seat Inspector
          </h3>

          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg">
                    {selectedSeat.seatNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Seat {selectedSeat.seatNumber}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedSeat.section}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  selectedSeat.status === "VACANT" 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : selectedSeat.status === "BOOKED"
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                }`}>
                  {selectedSeat.status}
                </span>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Charging Port: Yes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Locker: {selectedSeat.hasLocker ? "Included" : "None"}</span>
                </div>
              </div>

              {/* Occupant Details if Booked */}
              {selectedSeat.currentStudent ? (
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current Occupant
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
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
                    <span>Expires: {selectedSeat.currentStudent.validTill}</span>
                  </div>

                  {selectedSeat.currentStudent.dueAmount > 0 ? (
                    <div className="flex items-center justify-between rounded-lg bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      <span>Pending Fee Due:</span>
                      <span className="font-bold">₹{selectedSeat.currentStudent.dueAmount}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Fees Fully Paid</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button className="rounded-lg bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
                      Transfer Seat
                    </button>
                    <button className="rounded-lg bg-rose-50 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300">
                      Vacate / Release
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center space-y-3 dark:border-slate-800">
                  <Armchair className="h-8 w-8 mx-auto text-emerald-500" />
                  <div>
                    <h5 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      Seat is Currently Vacant
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Ready for allocation to any new or renewing student.
                    </p>
                  </div>
                  <button className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700">
                    Allot This Seat
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Armchair className="h-10 w-10 mb-2 stroke-[1.5]" />
              <p className="text-sm">Select any seat on the grid to inspect details and occupancy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

