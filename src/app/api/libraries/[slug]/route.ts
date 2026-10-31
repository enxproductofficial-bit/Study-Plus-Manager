import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    let library = await prisma.library.findUnique({
      where: { slug },
      include: {
        branches: {
          include: {
            shifts: {
              where: { isActive: true },
              select: { id: true, name: true, shiftType: true, startTime: true, endTime: true, is24Hour: true },
            },
            feePlans: {
              where: { isActive: true },
              select: { id: true, name: true, amount: true, registrationFee: true, durationDays: true },
            },
            seats: {
              select: { id: true, status: true },
            },
          },
        },
      },
    });

    // Fallback: If slug not found, fetch the primary active library
    if (!library) {
      library = await prisma.library.findFirst({
        where: { status: "ACTIVE" },
        include: {
          branches: {
            include: {
              shifts: {
                where: { isActive: true },
                select: { id: true, name: true, shiftType: true, startTime: true, endTime: true, is24Hour: true },
              },
              feePlans: {
                where: { isActive: true },
                select: { id: true, name: true, amount: true, registrationFee: true, durationDays: true },
              },
              seats: {
                select: { id: true, status: true },
              },
            },
          },
        },
      });
    }

    if (!library) {
      return NextResponse.json(
        { success: false, error: "Library not found" },
        { status: 404 }
      );
    }

    const primaryBranch = library.branches[0];
    const seats = primaryBranch?.seats || [];
    const totalSeats = seats.length || library.totalSeats || 48;
    const bookedSeats = seats.filter((s) => s.status === "BOOKED").length;
    const reservedSeats = seats.filter((s) => s.status === "RESERVED").length;
    const vacantSeats = totalSeats - (bookedSeats + reservedSeats);

    let facilities: string[] = [];
    try {
      facilities = library.facilities ? JSON.parse(library.facilities) : [];
    } catch {
      facilities = [
        "High-Speed Wi-Fi",
        "Air Conditioned Silent Zones",
        "Personal Lockers",
        "RO Water Purifier",
        "Power Sockets at Every Desk",
        "CCTV 24/7 Security",
      ];
    }

    return NextResponse.json({
      success: true,
      library: {
        id: library.id,
        code: library.code,
        slug: library.slug,
        name: library.name,
        tagline: library.tagline || "Study • Focus • Grow",
        ownerName: library.ownerName,
        contactPhone: library.ownerMobile,
        contactEmail: library.ownerEmail || "contact@enterprenex.solutions",
        address: library.address || "Plot 12, Shivaji Nagar, Near Modern College",
        city: library.city || "Pune",
        state: library.state || "Maharashtra",
        pincode: library.pincode || "411005",
        openingHours: library.openingHours || "06:00 AM - 12:00 AM (24/7 Available)",
        facilities,
        branchId: primaryBranch?.id || null,
        branchName: primaryBranch?.name || library.name,
        totalSeats,
        vacantSeats: Math.max(vacantSeats, 0),
        bookedSeats,
        reservedSeats,
        shifts: primaryBranch?.shifts || [],
        feePlans: primaryBranch?.feePlans.map((p) => ({
          ...p,
          amount: Number(p.amount),
          registrationFee: Number(p.registrationFee),
        })) || [],
      },
    });
  } catch (error: any) {
    console.error("Public Library page GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch library information" },
      { status: 500 }
    );
  }
}

