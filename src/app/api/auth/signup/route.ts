import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserRole, ShiftType, SeatStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      mobile,
      email,
      password,
      role = "OWNER",
      centreName,
      city = "Chh. Sambhajinagar",
      branchCode = "BR-01",
    } = body;

    // 1. Mandatory Validations
    if (!name || !mobile || !password) {
      return NextResponse.json(
        { error: "Full Name, Mobile Number, and Password are required." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 2. Check for duplicate mobile
    const existingUser = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: `An account with mobile number ${cleanMobile} already exists. Please Sign In.` },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    // 3. Handle Branch Assignment based on Role
    let assignedBranchId: string;
    let branchName = "Main Branch";

    if (role === "OWNER") {
      // Create new Abhyasika Centre / Branch for this Owner
      const branchCount = await prisma.branch.count();
      const newCode = `BR-${String(branchCount + 1).padStart(2, "0")}`;
      const newBranchName = centreName?.trim() || `GranthSetu Abhyasika - ${city || "Centre"}`;

      const newBranch = await prisma.branch.create({
        data: {
          name: newBranchName,
          code: newCode,
          city: city?.trim() || "Chh. Sambhajinagar",
          contactPhone: `+91 ${cleanMobile}`,
          contactEmail: email?.trim() || null,
        },
      });

      assignedBranchId = newBranch.id;
      branchName = newBranch.name;

      // Provision default 4 Shifts for this new branch
      const shifts = [
        { name: "Morning Shift", shiftType: ShiftType.MORNING, startTime: "06:00", endTime: "14:00", is24Hour: false },
        { name: "Afternoon Shift", shiftType: ShiftType.AFTERNOON, startTime: "14:00", endTime: "22:00", is24Hour: false },
        { name: "Evening Shift", shiftType: ShiftType.EVENING, startTime: "18:00", endTime: "23:00", is24Hour: false },
        { name: "24-Hour Full Day", shiftType: ShiftType.FULL_DAY_24HR, startTime: "00:00", endTime: "23:59", is24Hour: true },
      ];

      for (const s of shifts) {
        await prisma.shift.create({
          data: {
            branchId: newBranch.id,
            ...s,
          },
        });
      }

      // Provision standard fee plans
      await prisma.feePlan.createMany({
        data: [
          { branchId: newBranch.id, name: "Monthly Morning Shift (AC)", durationDays: 30, amount: 1500, registrationFee: 200 },
          { branchId: newBranch.id, name: "Monthly Afternoon Shift (AC)", durationDays: 30, amount: 1400, registrationFee: 200 },
          { branchId: newBranch.id, name: "Monthly Evening Shift (AC)", durationDays: 30, amount: 1200, registrationFee: 200 },
          { branchId: newBranch.id, name: "Monthly 24-Hour Full Day Access", durationDays: 30, amount: 2800, registrationFee: 200 },
        ],
      });

      // Provision initial 48 desks
      const seatRows = [];
      for (let i = 1; i <= 48; i++) {
        seatRows.push({
          branchId: newBranch.id,
          seatNumber: `S-${String(i).padStart(2, "0")}`,
          section: i <= 24 ? "Ground Floor (Quiet Zone - AC)" : "First Floor (General - AC)",
          status: SeatStatus.VACANT,
          hasLocker: i % 3 === 0,
          hasChargingPoint: true,
        });
      }
      await prisma.seat.createMany({ data: seatRows });

    } else {
      // Staff or Student joins existing branch
      let branch = await prisma.branch.findUnique({
        where: { code: branchCode.trim() },
      });

      if (!branch) {
        branch = await prisma.branch.findFirst();
      }

      if (!branch) {
        return NextResponse.json(
          { error: "No active Abhyasika branch found. Please register as an Owner first." },
          { status: 400 }
        );
      }

      assignedBranchId = branch.id;
      branchName = branch.name;
    }

    // 4. Create User Record
    const userRole = role === "OWNER" ? UserRole.OWNER : role === "STAFF" ? UserRole.STAFF : UserRole.STUDENT;

    const newUser = await prisma.user.create({
      data: {
        branchId: assignedBranchId,
        role: userRole,
        name: name.trim(),
        mobile: cleanMobile,
        email: email?.trim().toLowerCase() || null,
        passwordHash: hashedPassword,
        lastLoginAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Account created successfully! Welcome to GranthSetu, ${newUser.name}.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        mobile: newUser.mobile,
        email: newUser.email,
        role: newUser.role,
        branchId: assignedBranchId,
        branchName,
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { error: "Account creation failed", details: error.message },
      { status: 500 }
    );
  }
}
