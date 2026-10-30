import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/seats?shiftId=xyz&branchCode=BR-01
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get("branchCode") || "BR-01";
    const selectedShiftId = searchParams.get("shiftId");

    // 1. Get branch
    const branch = await prisma.branch.findUnique({
      where: { code: branchCode },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // 2. Fetch shifts
    const shifts = await prisma.shift.findMany({
      where: { branchId: branch.id, isActive: true },
      orderBy: { startTime: "asc" },
    });

    // Determine target shift (default to first morning shift if not provided)
    const activeShift = selectedShiftId
      ? shifts.find((s) => s.id === selectedShiftId) || shifts[0]
      : shifts[0];

    // 3. Fetch all physical seats
    const seats = await prisma.seat.findMany({
      where: { branchId: branch.id },
      orderBy: { seatNumber: "asc" },
    });

    // 4. Fetch active seat allocations
    const now = new Date();
    const activeAllocations = await prisma.seatAllocation.findMany({
      where: {
        seat: { branchId: branch.id },
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        student: {
          select: {
            fullName: true,
            mobile: true,
            studentRegNo: true,
          },
        },
        shift: true,
      },
    });

    // 5. Map seats with their live status for the active shift
    const liveSeats = seats.map((seat) => {
      // Find if this seat is booked for the selected shift OR has an active 24-hr shift
      const allocation = activeAllocations.find((a) => {
        if (a.seatId !== seat.id) return false;
        // If seat has 24-hour shift allocation, it blocks all shifts!
        if (a.shift.is24Hour) return true;
        // Otherwise, check if it matches the current shift
        return activeShift ? a.shiftId === activeShift.id : false;
      });

      let status = seat.status;
      if (allocation) {
        status = "BOOKED";
      }

      return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        section: seat.section,
        status: status,
        hasLocker: seat.hasLocker,
        hasChargingPoint: seat.hasChargingPoint,
        currentStudent: allocation
          ? {
              name: allocation.student.fullName,
              mobile: allocation.student.mobile,
              regNo: allocation.student.studentRegNo,
              shiftName: allocation.shift.name,
              validTill: allocation.endDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : undefined,
      };
    });

    const vacantCount = liveSeats.filter((s) => s.status === "VACANT").length;
    const bookedCount = liveSeats.filter((s) => s.status === "BOOKED").length;
    const reservedCount = liveSeats.filter((s) => s.status === "RESERVED").length;

    return NextResponse.json({
      branch: {
        id: branch.id,
        name: branch.name,
        code: branch.code,
      },
      shifts,
      activeShiftId: activeShift?.id,
      seats: liveSeats,
      metrics: {
        total: liveSeats.length,
        vacant: vacantCount,
        booked: bookedCount,
        reserved: reservedCount,
        occupancyRate: liveSeats.length > 0 ? Math.round((bookedCount / liveSeats.length) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching live seats from Neon:", error);
    return NextResponse.json(
      { error: "Failed to fetch live seat data from database" },
      { status: 500 }
    );
  }
}

// POST /api/seats/allot
// Quick Allotment with Double-Booking Prevention Rule
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seatId, shiftId, studentName, studentMobile, durationDays = 30 } = body;

    if (!seatId || !shiftId || !studentName || !studentMobile) {
      return NextResponse.json(
        { error: "Seat, shift, student name, and mobile are required" },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift) {
      return NextResponse.json({ error: "Invalid shift selected" }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + durationDays);

    // Enforce Business Rule #1 & #3: Double-booking prevention
    const existingConflict = await prisma.seatAllocation.findFirst({
      where: {
        seatId,
        status: "ACTIVE",
        OR: [
          // Same shift overlap
          { shiftId },
          // A 24-hr shift blocks everything
          { shift: { is24Hour: true } },
          // If we are booking a 24-hr shift, any existing shift blocks it
          ...(shift.is24Hour ? [{ status: "ACTIVE" as const }] : []),
        ],
        startDate: { lte: endDate },
        endDate: { gte: now },
      },
      include: { student: true, shift: true },
    });

    if (existingConflict) {
      return NextResponse.json(
        {
          error: `Double-Booking Prevented: Seat is already booked by ${existingConflict.student.fullName} for ${existingConflict.shift.name}.`,
        },
        { status: 409 }
      );
    }

    // Find or create student
    const branch = await prisma.branch.findFirst();
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 500 });
    }

    const student = await prisma.student.upsert({
      where: { mobile: studentMobile },
      update: { fullName: studentName },
      create: {
        branchId: branch.id,
        fullName: studentName,
        mobile: studentMobile,
        studentRegNo: `GS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        isMobileVerified: true,
      },
    });

    // Create allocation in Neon PostgreSQL
    const allocation = await prisma.seatAllocation.create({
      data: {
        studentId: student.id,
        seatId,
        shiftId,
        startDate: now,
        endDate: endDate,
        status: "ACTIVE",
        remarks: "Direct live desk allocation",
      },
      include: {
        student: true,
        seat: true,
        shift: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Seat ${allocation.seat.seatNumber} successfully allotted to ${student.fullName}!`,
      allocation,
    });
  } catch (error) {
    console.error("Error allotting seat in Neon:", error);
    return NextResponse.json(
      { error: "Failed to record seat allocation" },
      { status: 500 }
    );
  }
}

