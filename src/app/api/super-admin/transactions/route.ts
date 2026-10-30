import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filterType = searchParams.get("type") || "ALL"; // ALL, COMPANY_SUBSCRIPTION, STUDENT_FEE
    const filterStatus = searchParams.get("status") || "ALL"; // ALL, SUCCESS, PENDING, FAILED, REFUNDED
    const dateRange = searchParams.get("range") || "30D"; // TODAY, 7D, 30D, ALL

    let dateThreshold: Date | undefined;
    const now = new Date();
    if (dateRange === "TODAY") {
      dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === "7D") {
      dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === "30D") {
      dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const transactions: any[] = [];

    // 1. Fetch Company Subscriptions (Enterprenex Revenue)
    if (filterType === "ALL" || filterType === "COMPANY_SUBSCRIPTION") {
      const subscriptions = await prisma.companySubscription.findMany({
        where: {
          ...(dateThreshold ? { paymentDate: { gte: dateThreshold } } : {}),
          ...(filterStatus !== "ALL" ? { status: filterStatus as any } : {}),
        },
        include: {
          library: {
            select: { id: true, code: true, name: true, ownerName: true },
          },
        },
        orderBy: { paymentDate: "desc" },
      });

      for (const sub of subscriptions) {
        transactions.push({
          id: sub.id,
          transactionRef: sub.invoiceNumber,
          razorpayOrderId: sub.razorpayOrderId || `order_sub_${sub.id.slice(0, 8)}`,
          razorpayPaymentId: sub.razorpayPaymentId || `pay_sub_${sub.id.slice(0, 8)}`,
          paymentType: "COMPANY_SUBSCRIPTION",
          categoryLabel: "SaaS License (Enterprenex Revenue)",
          libraryId: sub.library.id,
          libraryCode: sub.library.code,
          libraryName: sub.library.name,
          payerName: sub.library.ownerName,
          studentId: null,
          studentRegNo: null,
          amount: Number(sub.amount),
          paymentMode: "RAZORPAY",
          status: sub.status,
          date: sub.paymentDate,
          notes: sub.notes || `${sub.tier} Subscription Payment`,
        });
      }
    }

    // 2. Fetch Library Student Collections (Individual Library Collections)
    if (filterType === "ALL" || filterType === "STUDENT_FEE") {
      const studentPayments = await prisma.payment.findMany({
        where: {
          paymentType: "STUDENT_FEE",
          ...(dateThreshold ? { createdAt: { gte: dateThreshold } } : {}),
          ...(filterStatus !== "ALL" ? { status: filterStatus as any } : {}),
        },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              studentRegNo: true,
              branch: {
                select: {
                  id: true,
                  name: true,
                  library: {
                    select: { id: true, code: true, name: true },
                  },
                },
              },
            },
          },
          receipt: {
            select: { receiptNumber: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      for (const pay of studentPayments) {
        transactions.push({
          id: pay.id,
          transactionRef: pay.receipt?.receiptNumber || `TXN-${pay.id.slice(0, 8).toUpperCase()}`,
          razorpayOrderId: pay.razorpayOrderId || "CASH_COUNTER",
          razorpayPaymentId: pay.razorpayPaymentId || "DIRECT_RECEIPT",
          paymentType: "STUDENT_FEE",
          categoryLabel: "Student Fee (Library Collection)",
          libraryId: pay.student.branch.library?.id || "N/A",
          libraryCode: pay.student.branch.library?.code || "LIB-001",
          libraryName: pay.student.branch.library?.name || pay.student.branch.name,
          payerName: pay.student.fullName,
          studentId: pay.student.id,
          studentRegNo: pay.student.studentRegNo,
          amount: Number(pay.amount),
          paymentMode: pay.mode,
          status: pay.status,
          date: pay.createdAt,
          notes: pay.remarks || "Desk Seat Fee Payment",
        });
      }
    }

    // Sort combined by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply keyword search filter if provided
    let filtered = transactions;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = transactions.filter(
        (t) =>
          t.transactionRef.toLowerCase().includes(q) ||
          t.razorpayOrderId.toLowerCase().includes(q) ||
          t.razorpayPaymentId.toLowerCase().includes(q) ||
          t.libraryName.toLowerCase().includes(q) ||
          t.payerName.toLowerCase().includes(q) ||
          (t.studentRegNo && t.studentRegNo.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      transactions: filtered,
    });
  } catch (error: any) {
    console.error("Super Admin transactions GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
