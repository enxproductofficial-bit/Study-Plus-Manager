// Core Types for GranthSetu - Abhyasika Management System

export type UserRole = "OWNER" | "STAFF" | "STUDENT";

export type ShiftType = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" | "FULL_DAY_24HR";

export type SeatStatus = "VACANT" | "BOOKED" | "RESERVED" | "MAINTENANCE";

export interface ShiftInfo {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  is24Hour?: boolean;
}

export interface SeatInfo {
  id: string;
  seatNumber: string;
  section: string;
  status: SeatStatus;
  hasLocker: boolean;
  hasChargingPoint: boolean;
  currentStudent?: {
    name: string;
    mobile: string;
    shiftName: string;
    validTill: string;
    dueAmount: number;
  };
}

export interface StudentAdmissionData {
  fullName: string;
  mobile: string;
  isMobileVerified: boolean;
  parentMobile: string;
  isParentMobileVerified: boolean;
  parentRelation: string;
  coursePreparingFor: string;
  aadhaarLast4: string;
  isAadhaarVerified: boolean;
  shiftId: string;
  seatNumber: string;
  planId: string;
  initialPayment: number;
  paymentMode: "CASH" | "UPI" | "RAZORPAY";
}

export interface MetricSummary {
  totalSeats: number;
  occupiedSeats: number;
  occupancyRate: number;
  todaysCollection: number;
  totalPendingDues: number;
  activeStudents: number;
  todaysAttendance: number;
}

