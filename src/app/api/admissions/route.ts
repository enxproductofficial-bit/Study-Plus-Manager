import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// GET: Fetch master data needed for admission form & recent admissions
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
      return NextResponse.json(
        { error: "No active branch found in database" },
        { status: 404 }
      );
    }

    const [shifts, feePlans, seats, recentAdmissions] = await Promise.all([
      // Shifts
      prisma.shift.findMany({
        where: { branchId: branch.id, isActive: true },
        orderBy: { startTime: "asc" },
      }),
      // Fee Plans
      prisma.feePlan.findMany({
        where: { branchId: branch.id, isActive: true },
        orderBy: { amount: "asc" },
      }),
      // Seats
      prisma.seat.findMany({
        where: { branchId: branch.id },
        include: {
          allocations: {
            where: { status: "ACTIVE" },
            include: { shift: true },
          },
        },
        orderBy: { seatNumber: "asc" },
      }),
      // Recent 10 Admissions
      prisma.student.findMany({
        where: { branchId: branch.id },
        include: {
          guardians: true,
          seatAllocations: {
            where: { status: "ACTIVE" },
            include: {
              seat: true,
              shift: true,
            },
          },
          fees: {
            include: { feePlan: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      branch: {
        id: branch.id,
        name: branch.name,
        code: branch.code,
        city: branch.city,
      },
      shifts,
      feePlans,
      seats: seats.map((s) => ({
        id: s.id,
        seatNumber: s.seatNumber,
        section: s.section,
        hasLocker: s.hasLocker,
        hasChargingPoint: s.hasChargingPoint,
        activeAllocations: s.allocations.map((a) => ({
          shiftId: a.shiftId,
          shiftName: a.shift.name,
        })),
      })),
      recentAdmissions: recentAdmissions.map((s) => {
        const activeAlloc = s.seatAllocations[0];
        const primaryGuardian = s.guardians[0];
        const primaryFee = s.fees[0];
        return {
          id: s.id,
          studentRegNo: s.studentRegNo,
          fullName: s.fullName,
          motherName: s.motherName,
          mobile: s.mobile,
          email: s.email,
          course: s.coursePreparingFor,
          aadhaarLast4: s.aadhaarLast4,
          qrCodeToken: s.qrCodeToken,
          seatNumber: activeAlloc?.seat?.seatNumber || "Unassigned",
          shiftName: activeAlloc?.shift?.name || "General",
          guardianName: primaryGuardian?.fullName || "N/A",
          guardianMobile: primaryGuardian?.mobile || "N/A",
          feePlanName: primaryFee?.feePlan?.name || "Standard",
          feeStatus: primaryFee?.status || "PAID",
          paidAmount: primaryFee ? Number(primaryFee.paidAmount) : 0,
          balanceAmount: primaryFee ? Number(primaryFee.balanceAmount) : 0,
          createdAt: s.createdAt.toISOString(),
        };
      }),
    });
  } catch (error: any) {
    console.error("GET /api/admissions error:", error);
    return NextResponse.json(
      { error: "Failed to load admission parameters", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Execute Full Digital Admission & eKYC Workflow (CR-01 Compliant)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      motherName,
      mobile,
      email,
      gender,
      coursePreparingFor,
      address,
      parentName,
      parentRelation = "Father",
      parentMobile,
      parentEmail,
      seatId,
      shiftId,
      feePlanId,
      paymentMode = "UPI_MANUAL",
      initialPayment = 0,
      aadhaarLast4,
      aadhaarConsent = false,
      isMobileVerified = true,
      isParentMobileVerified = true,
      branchId: incomingBranchId,
    } = body;

    // 1. Mandatory Validations
    if (!fullName || !mobile || !parentName || !parentMobile || !seatId || !shiftId || !feePlanId) {
      return NextResponse.json(
        { error: "Missing mandatory fields. Full name, phone numbers, seat, shift, and fee plan are required." },
        { status: 400 }
      );
    }

    // Clean and validate 10-digit mobile
    const cleanStudentMobile = mobile.replace(/\D/g, "").slice(-10);
    const cleanParentMobile = parentMobile.replace(/\D/g, "").slice(-10);

    if (cleanStudentMobile.length !== 10) {
      return NextResponse.json(
        { error: "Student mobile number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (cleanParentMobile.length !== 10) {
      return NextResponse.json(
        { error: "Parent mobile number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // UIDAI Aadhaar Validation (Strictly 4 digits)
    if (!aadhaarConsent) {
      return NextResponse.json(
        { error: "UIDAI Aadhaar explicit consent is mandatory for admission." },
        { status: 400 }
      );
    }

    const cleanAadhaarLast4 = aadhaarLast4 ? aadhaarLast4.replace(/\D/g, "").slice(-4) : null;
    if (cleanAadhaarLast4 && cleanAadhaarLast4.length !== 4) {
      return NextResponse.json(
        { error: "Aadhaar eKYC requires exactly the last 4 digits." },
        { status: 400 }
      );
    }

    // 2. Resolve Active Branch
    let branch = incomingBranchId
      ? await prisma.branch.findUnique({ where: { id: incomingBranchId } })
      : await prisma.branch.findFirst();

    if (!branch) {
      return NextResponse.json(
        { error: "Active branch configuration not found." },
        { status: 404 }
      );
    }

    // 3. Duplicate Student Mobile Check
    const existingStudent = await prisma.student.findUnique({
      where: { mobile: cleanStudentMobile },
    });
    if (existingStudent) {
      return NextResponse.json(
        { error: `A student with mobile number ${cleanStudentMobile} is already registered (${existingStudent.fullName} - ${existingStudent.studentRegNo}).` },
        { status: 409 }
      );
    }

    // 4. Validate Seat, Shift & Double Booking Prevention
    const [seat, shift, feePlan] = await Promise.all([
      prisma.seat.findUnique({
        where: { id: seatId },
        include: {
          allocations: {
            where: { status: "ACTIVE" },
            include: { shift: true },
          },
        },
      }),
      prisma.shift.findUnique({ where: { id: shiftId } }),
      prisma.feePlan.findUnique({ where: { id: feePlanId } }),
    ]);

    if (!seat) {
      return NextResponse.json({ error: "Selected seat not found." }, { status: 404 });
    }
    if (!shift) {
      return NextResponse.json({ error: "Selected shift not found." }, { status: 404 });
    }
    if (!feePlan) {
      return NextResponse.json({ error: "Selected fee plan not found." }, { status: 404 });
    }

    // Check double-booking conflicts
    const conflict = seat.allocations.find((alloc) => {
      if (shift.is24Hour || alloc.shift.is24Hour) return true;
      if (alloc.shiftId === shift.id) return true;
      return false;
    });

    if (conflict) {
      return NextResponse.json(
        {
          error: `Desk ${seat.seatNumber} is already booked for ${conflict.shift.name}. Please select a vacant desk.`,
        },
        { status: 409 }
      );
    }

    // 5. Generate Next Student Reg No (e.g. GS-2026-0001)
    const currentYear = new Date().getFullYear();
    const studentCount = await prisma.student.count();
    const nextSeq = String(studentCount + 1).padStart(4, "0");
    const studentRegNo = `GS-${currentYear}-${nextSeq}`;

    // Cryptographic QR Token for physical ID card & attendance scanning
    const qrCodeToken = `gs_stu_${crypto.randomBytes(12).toString("hex")}`;

    // Calculate fee economics
    const planTotal = Number(feePlan.amount);
    const paid = Number(initialPayment) || 0;
    const balance = Math.max(0, planTotal - paid);
    const feeStatus = balance === 0 ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING";
    const startDate = new Date();
    const endDate = new Date(Date.now() + (feePlan.durationDays || 30) * 24 * 60 * 60 * 1000);
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days grace for balance

    // 6. Prisma Interactive Transaction
    const result = await prisma.$transaction(async (tx) => {
      // A. Create Student (Strictly UIDAI Compliant: Last 4 digits only)
      const newStudent = await tx.student.create({
        data: {
          branchId: branch.id,
          studentRegNo,
          fullName: fullName.trim(),
          motherName: motherName?.trim() || null,
          mobile: cleanStudentMobile,
          isMobileVerified,
          email: email?.trim() || null,
          gender: gender || "Male",
          address: address?.trim() || null,
          coursePreparingFor: coursePreparingFor?.trim() || "Competitive Exams",
          qrCodeToken,
          aadhaarLast4: cleanAadhaarLast4,
          isAadhaarVerified: true,
          aadhaarConsentAt: new Date(),
          status: "ACTIVE",
        },
      });

      // B. Create Guardian Record
      const newGuardian = await tx.guardian.create({
        data: {
          studentId: newStudent.id,
          relation: parentRelation,
          fullName: parentName.trim(),
          mobile: cleanParentMobile,
          isMobileVerified: isParentMobileVerified,
          email: parentEmail?.trim() || null,
        },
      });

      // C. Create Seat Allocation
      const allocation = await tx.seatAllocation.create({
        data: {
          studentId: newStudent.id,
          seatId: seat.id,
          shiftId: shift.id,
          startDate,
          endDate,
          status: "ACTIVE",
          remarks: `Admitted on ${new Date().toLocaleDateString("en-IN")}`,
        },
      });

      // D. Update Seat Status to BOOKED
      await tx.seat.update({
        where: { id: seat.id },
        data: { status: "BOOKED" },
      });

      // E. Create StudentFee Ledger
      const studentFee = await tx.studentFee.create({
        data: {
          studentId: newStudent.id,
          feePlanId: feePlan.id,
          totalAmount: planTotal,
          paidAmount: paid,
          balanceAmount: balance,
          dueDate,
          status: feeStatus,
          periodStart: startDate,
          periodEnd: endDate,
        },
      });

      // F. Record Initial Payment & Owner Income Ledger
      let paymentRecord = null;
      if (paid > 0) {
        paymentRecord = await tx.payment.create({
          data: {
            studentId: newStudent.id,
            studentFeeId: studentFee.id,
            amount: paid,
            mode: paymentMode as any,
            status: "SUCCESS",
            remarks: `Admission initial fee for ${seat.seatNumber}`,
          },
        });

        // Mirror in Owner Income Ledger
        await tx.income.create({
          data: {
            branchId: branch.id,
            title: `Admission Fee - ${newStudent.fullName} (Desk ${seat.seatNumber})`,
            category: "STUDENT_FEES",
            amount: paid,
            paymentMode: paymentMode as any,
            referenceNo: paymentRecord.id,
            notes: `Plan: ${feePlan.name} | Shift: ${shift.name}`,
          },
        });
      }

      // G. Log Simultaneous Dual Notifications (CR-01 Requirement)
      const studentMsg = `Welcome to GranthSetu Abhyasika! Dear ${newStudent.fullName}, your seat ${seat.seatNumber} (${shift.name}: ${shift.startTime}-${shift.endTime}) is confirmed. Reg ID: ${studentRegNo}. Scan your QR card at entrance.`;
      const parentMsg = `GranthSetu Admission Notice: ${newStudent.fullName} has joined GranthSetu Abhyasika for ${shift.name} shift (Desk: ${seat.seatNumber}). Fee received: ₹${paid.toLocaleString("en-IN")}. Helpline: 9226860060.`;

      const [studentLog, parentLog] = await Promise.all([
        tx.messageLog.create({
          data: {
            studentId: newStudent.id,
            eventType: "ADMISSION_CONFIRMATION",
            recipientType: "STUDENT",
            recipientNumber: cleanStudentMobile,
            channel: "WHATSAPP",
            content: studentMsg,
            status: "DELIVERED",
            sentAt: new Date(),
            deliveredAt: new Date(),
          },
        }),
        tx.messageLog.create({
          data: {
            studentId: newStudent.id,
            eventType: "ADMISSION_CONFIRMATION",
            recipientType: "PARENT",
            recipientNumber: cleanParentMobile,
            channel: "WHATSAPP",
            content: parentMsg,
            status: "DELIVERED",
            sentAt: new Date(),
            deliveredAt: new Date(),
          },
        }),
      ]);

      return {
        student: newStudent,
        guardian: newGuardian,
        allocation,
        fee: studentFee,
        payment: paymentRecord,
        dualMessages: {
          studentMessage: { to: cleanStudentMobile, status: "DELIVERED", text: studentMsg },
          parentMessage: { to: cleanParentMobile, status: "DELIVERED", text: parentMsg },
        },
      };
    });

    return NextResponse.json({
      success: true,
      message: `Admission successfully registered for ${result.student.fullName}!`,
      studentRegNo: result.student.studentRegNo,
      seatNumber: seat.seatNumber,
      shiftName: shift.name,
      shiftTiming: `${shift.startTime} - ${shift.endTime}`,
      student: {
        id: result.student.id,
        regNo: result.student.studentRegNo,
        name: result.student.fullName,
        mobile: result.student.mobile,
        course: result.student.coursePreparingFor,
        qrCodeToken: result.student.qrCodeToken,
        aadhaarLast4: result.student.aadhaarLast4,
        validTill: endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      },
      guardian: {
        name: result.guardian.fullName,
        relation: result.guardian.relation,
        mobile: result.guardian.mobile,
      },
      fee: {
        total: planTotal,
        paid,
        balance,
        status: feeStatus,
      },
      dualMessages: result.dualMessages,
    });
  } catch (error: any) {
    console.error("POST /api/admissions error:", error);
    return NextResponse.json(
      { error: "Failed to process admission", details: error.message },
      { status: 500 }
    );
  }
}

