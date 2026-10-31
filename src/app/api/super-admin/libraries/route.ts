import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    const whereClause: any = {};

    if (status !== "ALL") {
      whereClause.status = status;
    }

    if (search.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { ownerName: { contains: search, mode: "insensitive" } },
        { ownerMobile: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const libraries = await prisma.library.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { branches: true },
        },
        branches: {
          select: {
            id: true,
            name: true,
            code: true,
            _count: {
              select: { students: true, seats: true },
            },
          },
        },
        subscriptions: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const formatted = libraries.map((lib) => {
      const totalStudents = lib.branches.reduce((acc, b) => acc + b._count.students, 0);
      const totalAllocatedSeats = lib.branches.reduce((acc, b) => acc + b._count.seats, 0);

      return {
        id: lib.id,
        code: lib.code,
        slug: lib.slug,
        name: lib.name,
        tagline: lib.tagline,
        ownerName: lib.ownerName,
        ownerMobile: lib.ownerMobile,
        ownerEmail: lib.ownerEmail,
        city: lib.city || "Pune",
        state: lib.state || "Maharashtra",
        totalSeats: lib.totalSeats || totalAllocatedSeats || 48,
        activeStudents: totalStudents,
        branchesCount: lib._count.branches,
        status: lib.status,
        subscriptionTier: lib.subscriptionTier,
        monthlyFee: Number(lib.monthlyFee),
        subscriptionEnds: lib.subscriptions[0]?.validUntil || null,
        lastPayment: lib.subscriptions[0]
          ? {
              amount: Number(lib.subscriptions[0].amount),
              date: lib.subscriptions[0].paymentDate,
              invoice: lib.subscriptions[0].invoiceNumber,
            }
          : null,
        createdAt: lib.createdAt,
      };
    });

    return NextResponse.json({ success: true, libraries: formatted });
  } catch (error: any) {
    console.error("Super Admin libraries GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch libraries" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { libraryId, status, subscriptionTier } = body;

    if (!libraryId) {
      return NextResponse.json(
        { success: false, error: "libraryId is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.library.update({
      where: { id: libraryId },
      data: {
        ...(status ? { status } : {}),
        ...(subscriptionTier ? { subscriptionTier } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Library ${updated.name} updated successfully`,
      library: updated,
    });
  } catch (error: any) {
    console.error("Super Admin library PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update library" },
      { status: 500 }
    );
  }
}

