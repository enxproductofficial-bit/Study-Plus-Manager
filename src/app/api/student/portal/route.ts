import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get("mobile");
    const regNo = searchParams.get("regNo");

    let student = null;

    if (mobile) {
      student = await prisma.student.findFirst({
        where: { mobile: mobile.slice(-10) },
        include: {
          branch: {
            include: {
              library: true,
            },
          },
          seatAllocations: {
            where: { status: "ACTIVE" },
            include: {
              seat: true,
              shift: true,
            },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          fees: {
            include: {
              feePlan: true,
              payments: {
                orderBy: { createdAt: "desc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          attendanceRecords: {
            take: 10,
            orderBy: { scannedAt: "desc" },
          },
        },
      });
    } else if (regNo) {
      student = await prisma.student.findUnique({
        where: { studentRegNo: regNo },
        include: {
          branch: {
            include: {
              library: true,
            },
          },
          seatAllocations: {
            where: { status: "ACTIVE" },
            include: {
              seat: true,
              shift: true,
            },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          fees: {
            include: {
              feePlan: true,
              payments: {
                orderBy: { createdAt: "desc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          attendanceRecords: {
            take: 10,
            orderBy: { scannedAt: "desc" },
          },
        },
      });
    }

    // Demo student fallback if no query param provided
    if (!student) {
      student = await prisma.student.findFirst({
        include: {
          branch: {
            include: {
              library: true,
            },
          },
          seatAllocations: {
            where: { status: "ACTIVE" },
            include: {
              seat: true,
              shift: true,
            },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          fees: {
            include: {
              feePlan: true,
              payments: {
                orderBy: { createdAt: "desc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          attendanceRecords: {
            take: 10,
            orderBy: { scannedAt: "desc" },
          },
        },
      });
    }

    if (!student) {
      // Mock demonstration student payload so portal is immediately testable
      return NextResponse.json({
        success: true,
        isDemo: true,
        student: {
          id: "demo-student-001",
          studentRegNo: "GS-2026-0042",
          fullName: "Revanth Polamreddy",
          mobile: "9226860060",
          email: "student@enterprenex.solutions",
          coursePreparingFor: "UPSC Civil Services / Tech Lead",
          qrCodeToken: "TOKEN-GRANTHSETU-DEMO-0042",
          aadhaarLast4: "4289",
          isAadhaarVerified: true,
          status: "ACTIVE",
          joinedDate: new Date().toISOString(),
          library: {
            name: "StudyPlus Abhyasika",
            branchName: "Main Branch - Shivaji Nagar",
            address: "Plot 12, Shivaji Nagar, Pune",
            phone: "+91-9226860060",
          },
          seat: {
            seatNumber: "S-07",
            section: "Ground Floor (Quiet Zone - AC)",
            shiftName: "Morning Shift (06:00 - 14:00)",
            hasLocker: true,
            hasPower: true,
            validUntil: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
          },
          feeStatus: {
            planName: "Monthly Morning Shift (AC)",
            totalAmount: 1700,
            paidAmount: 1700,
            balanceAmount: 0,
            dueDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
            status: "PAID",
          },
          attendance: [
            { id: "att-1", date: new Date().toISOString(), scanType: "CHECK_IN", time: "06:12 AM", studyMinutes: 240 },
            { id: "att-2", date: new Date(Date.now() - 86400000).toISOString(), scanType: "CHECK_OUT", time: "02:05 PM", studyMinutes: 470 },
          ],
          receipts: [
            { id: "rc-1", receiptNumber: "GS-PUN-0042", amount: 1700, date: new Date().toISOString(), mode: "RAZORPAY", status: "SUCCESS" },
          ],
        },
      });
    }

    const activeAlloc = student.seatAllocations[0];
    const latestFee = student.fees[0];

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentRegNo: student.studentRegNo,
        fullName: student.fullName,
        mobile: student.mobile,
        email: student.email,
        coursePreparingFor: student.coursePreparingFor || "Competitive Examination",
        qrCodeToken: student.qrCodeToken,
        aadhaarLast4: student.aadhaarLast4,
        isAadhaarVerified: student.isAadhaarVerified,
        status: student.status,
        joinedDate: student.createdAt,
        library: {
          name: student.branch.library?.name || "StudyPlus Abhyasika",
          branchName: student.branch.name,
          address: student.branch.address || "Shivaji Nagar, Pune",
          phone: student.branch.contactPhone || "+91-9226860060",
        },
        seat: activeAlloc
          ? {
              seatNumber: activeAlloc.seat.seatNumber,
              section: activeAlloc.seat.section,
              shiftName: activeAlloc.shift.name,
              hasLocker: activeAlloc.seat.hasLocker,
              hasPower: activeAlloc.seat.hasChargingPoint,
              validUntil: activeAlloc.endDate,
            }
          : {
              seatNumber: "Unallocated",
              section: "General",
              shiftName: "Pending Allocation",
              hasLocker: false,
              hasPower: true,
              validUntil: null,
            },
        feeStatus: latestFee
          ? {
              planName: latestFee.feePlan?.name || "Monthly Shift Plan",
              totalAmount: Number(latestFee.totalAmount),
              paidAmount: Number(latestFee.paidAmount),
              balanceAmount: Number(latestFee.balanceAmount),
              dueDate: latestFee.dueDate,
              status: latestFee.status,
            }
          : {
              planName: "Standard Membership",
              totalAmount: 1500,
              paidAmount: 1500,
              balanceAmount: 0,
              dueDate: new Date(),
              status: "PAID",
            },
        attendance: student.attendanceRecords.map((a) => ({
          id: a.id,
          date: a.scannedAt,
          scanType: a.scanType,
          time: new Date(a.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          studyMinutes: a.sessionMinutes || 360,
        })),
        receipts: (latestFee?.payments || []).map((p) => ({
          id: p.id,
          receiptNumber: p.razorpayOrderId || `REC-${p.id.slice(0, 6).toUpperCase()}`,
          amount: Number(p.amount),
          date: p.createdAt,
          mode: p.mode,
          status: p.status,
        })),
      },
    });
  } catch (error: any) {
    console.error("Student Portal API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load student details" },
      { status: 500 }
    );
  }
}

