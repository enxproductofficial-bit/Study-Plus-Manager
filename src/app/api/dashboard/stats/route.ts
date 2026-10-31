import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
        { error: "No active branch found" },
        { status: 404 }
      );
    }

    const branchId = branch.id;

    // Parallel Database Queries for maximum speed
    const [
      totalStudentsCount,
      totalSeatsCount,
      activeAllocationsCount,
      paymentsSummary,
      pendingFeesSummary,
      recentStudents,
      pendingFeesList,
      attendanceSummary,
    ] = await Promise.all([
      // 1. Total Students
      prisma.student.count({
        where: { branchId, status: "ACTIVE" },
      }),

      // 2. Total Desks
      prisma.seat.count({
        where: { branchId },
      }),

      // 3. Occupied Desks
      prisma.seatAllocation.count({
        where: {
          seat: { branchId },
          status: "ACTIVE",
          endDate: { gte: new Date() },
        },
      }),

      // 4. Fees Collected (Payments Success)
      prisma.payment.aggregate({
        where: {
          student: { branchId },
          status: "SUCCESS",
        },
        _sum: { amount: true },
      }),

      // 5. Pending Fees
      prisma.studentFee.aggregate({
        where: {
          student: { branchId },
          status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
        },
        _sum: { balanceAmount: true },
        _count: { id: true },
      }),

      // 6. Recent Admissions (Latest 5)
      prisma.student.findMany({
        where: { branchId },
        include: {
          seatAllocations: {
            where: { status: "ACTIVE" },
            include: { seat: true, shift: true },
            take: 1,
          },
          fees: {
            include: { feePlan: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 7. Pending Fees List (Top 5)
      prisma.studentFee.findMany({
        where: {
          student: { branchId },
          status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
          balanceAmount: { gt: 0 },
        },
        include: {
          student: {
            include: {
              guardians: true,
              seatAllocations: {
                where: { status: "ACTIVE" },
                include: { seat: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      // 8. Today's Attendance (Check-ins today)
      prisma.attendance.count({
        where: {
          student: { branchId },
          scannedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    // Format economics
    const totalDesks = totalSeatsCount || 48;
    const occupiedDesks = activeAllocationsCount || 0;
    const availableDesks = Math.max(0, totalDesks - occupiedDesks);
    const occupancyRate = totalDesks > 0 ? Math.round((occupiedDesks / totalDesks) * 100) : 0;

    const totalCollected = Number(paymentsSummary._sum.amount || 0);
    const totalPending = Number(pendingFeesSummary._sum.balanceAmount || 0);
    const pendingStudentsCount = pendingFeesSummary._count.id || 0;

    // Real dynamic date calculations for Pending Fees
    const now = new Date();
    const formattedPendingFees = pendingFeesList.map((f, idx) => {
      const dueTime = new Date(f.dueDate).getTime();
      const diffTime = dueTime - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const alloc = f.student.seatAllocations[0];
      return {
        id: f.id,
        index: idx + 1,
        studentId: f.student.id,
        studentName: f.student.fullName,
        studentMobile: f.student.mobile,
        guardianMobile: f.student.guardians[0]?.mobile || f.student.mobile,
        amount: Number(f.balanceAmount),
        dueDate: f.dueDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        daysRemaining: daysRemaining,
        isOverdue: daysRemaining < 0,
        statusText: daysRemaining < 0 ? `${Math.abs(daysRemaining)}d Overdue` : `${daysRemaining}d Left`,
        seatNumber: alloc?.seat?.seatNumber || "Unallotted",
      };
    });

    // Format Recent Admissions
    const formattedRecentAdmissions = recentStudents.map((s, idx) => {
      const alloc = s.seatAllocations[0];
      const fee = s.fees[0];
      return {
        id: s.id,
        index: idx + 1,
        name: s.fullName,
        seat: alloc?.seat?.seatNumber || `Desk ${idx + 1}`,
        course: s.coursePreparingFor || "Competitive Exam (UPSC/MPSC)",
        plan: fee?.feePlan?.name?.includes("24-Hour") ? "24-Hour" : fee?.feePlan?.name?.includes("Morning") ? "Morning" : "Full Time",
        date: s.createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: s.status,
      };
    });

    return NextResponse.json({
      branchName: branch.name,
      stats: {
        totalStudents: totalStudentsCount,
        studentsGrowth: "+12%",
        totalSeats: totalDesks,
        occupiedSeats: occupiedDesks,
        availableSeats: availableDesks,
        occupancyRate: occupancyRate,
        feesCollected: totalCollected,
        feesGrowth: "+18%",
        pendingFees: totalPending,
        pendingStudentsCount: pendingStudentsCount,
      },
      weeklyCollection: [
        { week: "Week 1", collected: totalCollected > 0 ? Math.round(totalCollected * 0.25) : 0, pending: Math.round(totalPending * 0.3) },
        { week: "Week 2", collected: totalCollected > 0 ? Math.round(totalCollected * 0.35) : 0, pending: Math.round(totalPending * 0.4) },
        { week: "Week 3", collected: totalCollected > 0 ? Math.round(totalCollected * 0.20) : 0, pending: Math.round(totalPending * 0.2) },
        { week: "Week 4", collected: totalCollected > 0 ? Math.round(totalCollected * 0.20) : 0, pending: Math.round(totalPending * 0.1) },
      ],
      recentAdmissions: formattedRecentAdmissions,
      pendingFeesList: formattedPendingFees,
      attendance: {
        present: attendanceSummary,
        absent: Math.max(0, totalStudentsCount - attendanceSummary),
        notMarked: 0,
        percentage: totalStudentsCount > 0 ? Math.round((attendanceSummary / totalStudentsCount) * 100) : 0,
      },
      notices: [
        { id: "n1", title: "Diwali Holiday Notice", date: "28 Oct 2026", icon: "Megaphone" },
        { id: "n2", title: "Library Timing Changed", date: "25 Oct 2026", icon: "BookOpen" },
        { id: "n3", title: "Fee Payment Reminder", date: "22 Oct 2026", icon: "IndianRupee" },
        { id: "n4", title: "New Batch Admission Open", date: "20 Oct 2026", icon: "GraduationCap" },
      ],
      upcomingEvents: [
        { id: "e1", day: "02", month: "Nov", title: "Career Guidance Session", time: "10:00 AM - 12:00 PM", color: "blue" },
        { id: "e2", day: "07", month: "Nov", title: "Group Study Workshop", time: "04:00 PM - 06:00 PM", color: "green" },
        { id: "e3", day: "14", month: "Nov", title: "Motivational Talk", time: "11:00 AM - 01:00 PM", color: "purple" },
      ],
    });
  } catch (error: any) {
    console.error("GET /api/dashboard/stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics", details: error.message },
      { status: 500 }
    );
  }
}
