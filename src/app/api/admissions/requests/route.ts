import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { SeatStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET: List all pending and recent self-admission requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get("branchCode") || "BR-01";

    let branch = await prisma.branch.findUnique({
      where: { code: branchCode },
    });

    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    if (!branch) {
      return NextResponse.json({ requests: [] });
    }

    const requests = await prisma.admissionRequest.findMany({
      where: {
        branchId: branch.id,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      requests: requests.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        motherName: r.motherName || "Not Provided",
        mobile: r.mobile,
        parentMobile: r.parentMobile || r.mobile,
        parentName: r.parentName || "Parent",
        course: r.coursePreparingFor || "Competitive exam (UPSC / MPSC)",
        preferredShift: r.preferredShift || "Morning Shift",
        gender: r.gender || "Male",
        appliedAt: r.createdAt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  } catch (error: any) {
    console.error("GET /api/admissions/requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission requests", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Student submits self-admission form via QR code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      motherName,
      mobile,
      email,
      gender,
      parentName,
      parentMobile,
      coursePreparingFor,
      preferredShift,
      aadhaarLast4,
    } = body;

    if (!fullName || !motherName || !mobile || !parentMobile) {
      return NextResponse.json(
        { error: "Full Name, Mother's Name, Student Mobile, and Parent Mobile are required." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    const cleanParentMobile = parentMobile.replace(/\D/g, "").slice(-10);

    let branch = await prisma.branch.findFirst();
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const newRequest = await prisma.admissionRequest.create({
      data: {
        branchId: branch.id,
        fullName: fullName.trim(),
        motherName: motherName.trim(),
        mobile: cleanMobile,
        email: email?.trim() || null,
        gender: gender || "Male",
        parentName: parentName?.trim() || null,
        parentMobile: cleanParentMobile,
        coursePreparingFor: coursePreparingFor || "Competitive exam (UPSC / MPSC)",
        preferredShift: preferredShift || "Morning Shift",
        aadhaarLast4: aadhaarLast4?.slice(-4) || "8821",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      requestId: newRequest.id,
      message: "Application submitted successfully! Please visit the counter to confirm seat allotment.",
    });
  } catch (error: any) {
    console.error("POST /api/admissions/requests error:", error);
    return NextResponse.json(
      { error: "Failed to submit self-admission", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Owner Accepts or Rejects the application (Photo 2 Item 1b)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { requestId, action, seatId, shiftId, feePlanId } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: "Request ID and action are required" }, { status: 400 });
    }

    const req = await prisma.admissionRequest.findUnique({
      where: { id: requestId },
      include: { branch: true },
    });

    if (!req) {
      return NextResponse.json({ error: "Admission request not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      await prisma.admissionRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Admission request rejected" });
    }

    if (action === "ACCEPT") {
      // Find vacant seat or use specified seat
      let targetSeat = seatId
        ? await prisma.seat.findUnique({ where: { id: seatId } })
        : await prisma.seat.findFirst({
            where: { branchId: req.branchId, status: SeatStatus.VACANT },
          });

      if (!targetSeat) {
        targetSeat = await prisma.seat.findFirst({ where: { branchId: req.branchId } });
      }

      // Find shift
      let targetShift = shiftId
        ? await prisma.shift.findUnique({ where: { id: shiftId } })
        : await prisma.shift.findFirst({ where: { branchId: req.branchId } });

      // Find fee plan
      let targetPlan = feePlanId
        ? await prisma.feePlan.findUnique({ where: { id: feePlanId } })
        : await prisma.feePlan.findFirst({ where: { branchId: req.branchId } });

      const studentCount = await prisma.student.count({ where: { branchId: req.branchId } });
      const studentRegNo = `GS-2026-${String(studentCount + 1).padStart(4, "0")}`;
      const qrCodeToken = crypto.randomBytes(16).toString("hex");

      // Transaction to create student, guardian, allocation and fee
      const newStudent = await prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
          data: {
            branchId: req.branchId,
            studentRegNo,
            fullName: req.fullName,
            motherName: req.motherName,
            mobile: req.mobile,
            isMobileVerified: true,
            email: req.email,
            gender: req.gender || "Male",
            coursePreparingFor: req.coursePreparingFor || "Competitive exam (UPSC / MPSC)",
            qrCodeToken,
            aadhaarLast4: req.aadhaarLast4 || "8821",
            isAadhaarVerified: true,
            status: "ACTIVE",
          },
        });

        if (req.parentMobile) {
          await tx.guardian.create({
            data: {
              studentId: student.id,
              fullName: req.parentName || "Parent",
              mobile: req.parentMobile,
              relation: "Parent",
            },
          });
        }

        if (targetSeat && targetShift) {
          await tx.seat.update({
            where: { id: targetSeat.id },
            data: { status: SeatStatus.BOOKED },
          });

          await tx.seatAllocation.create({
            data: {
              studentId: student.id,
              seatId: targetSeat.id,
              shiftId: targetShift.id,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: "ACTIVE",
            },
          });
        }

        if (targetPlan) {
          await tx.studentFee.create({
            data: {
              studentId: student.id,
              feePlanId: targetPlan.id,
              totalAmount: targetPlan.amount,
              paidAmount: targetPlan.amount,
              balanceAmount: 0,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: "PAID",
              periodStart: new Date(),
              periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }

        await tx.admissionRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED" },
        });

        return student;
      });

      return NextResponse.json({
        success: true,
        message: `Admission accepted! Student ${newStudent.fullName} created with Reg ID ${studentRegNo}.`,
        student: newStudent,
        seatNumber: targetSeat?.seatNumber,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/admissions/requests error:", error);
    return NextResponse.json(
      { error: "Failed to process admission request", details: error.message },
      { status: 500 }
    );
  }
}
