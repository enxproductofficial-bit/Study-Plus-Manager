import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please enter your mobile/email and password." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();
    const isMobile = /^\d{10}$/.test(cleanIdentifier.replace(/\D/g, "").slice(-10));
    const cleanMobile = isMobile ? cleanIdentifier.replace(/\D/g, "").slice(-10) : "";

    // 1. Find user by mobile or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanMobile ? [{ mobile: cleanMobile }] : []),
          { email: cleanIdentifier.toLowerCase() },
          { name: cleanIdentifier },
        ],
      },
      include: {
        branch: true,
      },
    });

    // Fallback: If database was not seeded with standard mobile, auto-seed default owner
    if (!user && (cleanIdentifier === "9876543210" || cleanIdentifier.toLowerCase() === "owner@granthsetu.in" || cleanIdentifier.toLowerCase() === "admin")) {
      let branch = await prisma.branch.findFirst();
      if (!branch) {
        branch = await prisma.branch.create({
          data: {
            name: "Main Branch - Shivaji Nagar",
            code: "BR-01",
            city: "Pune",
          },
        });
      }

      user = await prisma.user.create({
        data: {
          branchId: branch.id,
          role: "OWNER",
          name: "Adhyaksha (Owner)",
          mobile: "9876543210",
          email: "owner@granthsetu.in",
          passwordHash: hashPassword(password),
        },
        include: { branch: true },
      });
    }

    // Fallback: If staff demo
    if (!user && (cleanIdentifier === "9876543211" || cleanIdentifier.toLowerCase() === "staff@granthsetu.in" || cleanIdentifier.toLowerCase() === "staff")) {
      let branch = await prisma.branch.findFirst();
      if (!branch) {
        branch = await prisma.branch.create({
          data: {
            name: "Main Branch - Shivaji Nagar",
            code: "BR-01",
            city: "Pune",
          },
        });
      }

      user = await prisma.user.create({
        data: {
          branchId: branch.id,
          role: "STAFF",
          name: "Desk Officer (Staff)",
          mobile: "9876543211",
          email: "staff@granthsetu.in",
          passwordHash: hashPassword(password),
        },
        include: { branch: true },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Account not found. Please check your credentials or create a new account." },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "This account has been deactivated. Contact the administrator." },
        { status: 403 }
      );
    }

    // 2. Check Password
    if (user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }
    } else {
      // First-time login: update password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashPassword(password) },
      });
    }

    // 3. Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        branchName: user.branch?.name || "Main Branch - Shivaji Nagar",
        branchCode: user.branch?.code || "BR-01",
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}

