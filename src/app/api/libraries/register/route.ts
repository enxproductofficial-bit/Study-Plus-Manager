import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ShiftType, SeatStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      ownerName,
      ownerMobile,
      ownerEmail,
      libraryName,
      tagline,
      address,
      city,
      state = "Maharashtra",
      pincode,
      totalSeats = 48,
      branchesCount = 1,
      password,
    } = body;

    // Validate required fields
    if (!ownerName || !ownerMobile || !libraryName || !password) {
      return NextResponse.json(
        { success: false, error: "Owner name, mobile, library name, and password are required" },
        { status: 400 }
      );
    }

    // Clean mobile number (strip spaces and +91)
    const cleanMobile = ownerMobile.replace(/\D/g, "").slice(-10);
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Check if mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this mobile number already exists. Please login." },
        { status: 409 }
      );
    }

    // Generate unique slug
    const baseSlug = libraryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Generate sequential Library ID (e.g. LIB-2026-003)
    const count = await prisma.library.count();
    const libraryCode = `LIB-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    // 1. Create Library Tenant
    const library = await prisma.library.create({
      data: {
        code: libraryCode,
        slug,
        name: libraryName,
        tagline: tagline || "Study • Focus • Grow",
        ownerName,
        ownerMobile: cleanMobile,
        ownerEmail: ownerEmail || null,
        address: address || null,
        city: city || "Pune",
        state: state || "Maharashtra",
        pincode: pincode || null,
        totalSeats: Number(totalSeats) || 48,
        status: "ACTIVE",
        subscriptionTier: "GROWTH",
        monthlyFee: 2499.00,
        facilities: JSON.stringify([
          "High-Speed Wi-Fi",
          "Quiet AC Zones",
          "Ergonomic Study Desks",
          "Power Sockets at Every Desk",
          "RO Filtered Drinking Water",
          "CCTV Surveillance 24/7",
        ]),
        openingHours: "06:00 AM - 12:00 AM (24/7 Available)",
      },
    });

    // 2. Create Initial Branch
    const branchCode = `BR-${String(count + 1).padStart(2, "0")}`;
    const branch = await prisma.branch.create({
      data: {
        libraryId: library.id,
        name: `${libraryName} (Main Branch)`,
        code: branchCode,
        address: address || null,
        city: city || "Pune",
        contactPhone: cleanMobile,
        contactEmail: ownerEmail || null,
      },
    });

    // 3. Create Owner User
    const passwordHash = hashPassword(password);
    const owner = await prisma.user.create({
      data: {
        branchId: branch.id,
        role: "OWNER",
        name: ownerName,
        mobile: cleanMobile,
        email: ownerEmail || `${cleanMobile}@granthsetu.in`,
        passwordHash,
      },
    });

    // 4. Create Standard 4 Shifts
    const standardShifts = [
      { name: "Morning Shift", shiftType: ShiftType.MORNING, startTime: "06:00", endTime: "14:00", is24Hour: false },
      { name: "Afternoon Shift", shiftType: ShiftType.AFTERNOON, startTime: "14:00", endTime: "22:00", is24Hour: false },
      { name: "Evening Shift", shiftType: ShiftType.EVENING, startTime: "18:00", endTime: "23:00", is24Hour: false },
      { name: "24-Hour Full Day", shiftType: ShiftType.FULL_DAY_24HR, startTime: "00:00", endTime: "23:59", is24Hour: true },
    ];

    const createdShifts: any[] = [];
    for (const s of standardShifts) {
      const shift = await prisma.shift.create({
        data: {
          branchId: branch.id,
          ...s,
        },
      });
      createdShifts.push(shift);
    }

    // 5. Create Standard Fee Plans
    const plansData = [
      { name: "Monthly Morning Shift (AC)", shiftId: createdShifts[0].id, durationDays: 30, amount: 1500, registrationFee: 200 },
      { name: "Monthly Afternoon Shift (AC)", shiftId: createdShifts[1].id, durationDays: 30, amount: 1400, registrationFee: 200 },
      { name: "Monthly Evening Shift (AC)", shiftId: createdShifts[2].id, durationDays: 30, amount: 1200, registrationFee: 200 },
      { name: "Monthly 24-Hour Full Access", shiftId: createdShifts[3].id, durationDays: 30, amount: 2800, registrationFee: 200 },
    ];

    for (const plan of plansData) {
      await prisma.feePlan.create({
        data: {
          branchId: branch.id,
          ...plan,
        },
      });
    }

    // 6. Provision Desks (Up to 48 physical desks)
    const seatsToCreate = Math.min(Number(totalSeats) || 48, 48);
    for (let i = 1; i <= seatsToCreate; i++) {
      const seatNumber = `S-${String(i).padStart(2, "0")}`;
      const section = i <= 24 ? "Ground Floor (Quiet Zone - AC)" : "First Floor (General - AC)";
      await prisma.seat.create({
        data: {
          branchId: branch.id,
          seatNumber,
          section,
          status: SeatStatus.VACANT,
          hasLocker: i % 3 === 0,
          hasChargingPoint: true,
        },
      });
    }

    // 7. Record 30-Day Free SaaS Trial Subscription for the new library
    const subInvoice = `ENX-SUB-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    await prisma.companySubscription.create({
      data: {
        libraryId: library.id,
        tier: "GROWTH",
        amount: 2499.00,
        billingCycle: "MONTHLY",
        status: "SUCCESS",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        invoiceNumber: subInvoice,
        notes: "30-Day Growth Plan Trial Activated upon Library Registration",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Congratulations! ${libraryName} has been successfully registered on GranthSetu.`,
      library: {
        id: library.id,
        code: library.code,
        name: library.name,
        slug: library.slug,
        ownerName: library.ownerName,
        totalSeats: library.totalSeats,
        publicUrl: `/l/${library.slug}`,
      },
      user: {
        id: owner.id,
        name: owner.name,
        mobile: owner.mobile,
        email: owner.email,
        role: "OWNER",
        branchId: branch.id,
        branchName: branch.name,
      },
    });
  } catch (error: any) {
    console.error("Library registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register study centre" },
      { status: 500 }
    );
  }
}

