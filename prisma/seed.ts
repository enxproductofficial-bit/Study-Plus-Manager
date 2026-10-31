import { PrismaClient, UserRole, ShiftType, SeatStatus, LibraryStatus, SubscriptionTier, PaymentMode, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GranthSetu Multi-Tenant Database...");

  // 0. Create Super Admin (Enterprenex Solution Pvt. Ltd.)
  const superAdmin = await prisma.user.upsert({
    where: { mobile: "9226860060" },
    update: {
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      role: UserRole.SUPER_ADMIN,
      name: "Enterprenex Super Admin",
      mobile: "9226860060",
      email: "admin@enterprenex.solutions",
    },
  });
  console.log(`✓ Super Admin created: ${superAdmin.name} (${superAdmin.mobile})`);

  // 1. Create Primary Library Tenant
  const library = await prisma.library.upsert({
    where: { code: "LIB-2026-001" },
    update: {},
    create: {
      code: "LIB-2026-001",
      slug: "studyplus-shivajinagar",
      name: "StudyPlus Abhyasika",
      tagline: "Study • Focus • Grow - Premium Reading Room",
      ownerName: "Adhyaksha (Owner)",
      ownerMobile: "9876543210",
      ownerEmail: "owner@studyplus.in",
      address: "Plot 12, Shivaji Nagar, Near Modern College",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
      totalSeats: 48,
      status: LibraryStatus.ACTIVE,
      subscriptionTier: SubscriptionTier.GROWTH,
      monthlyFee: 2499.00,
      facilities: JSON.stringify(["High-Speed Wi-Fi", "Quiet AC Zones", "Personal Lockers", "RO Water", "Power at Every Desk", "CCTV Surveillance", "Cafeteria Access"]),
      openingHours: "06:00 AM - 12:00 AM (24/7 Available)",
    },
  });
  console.log(`✓ Library registered: ${library.name} (${library.code})`);

  // Second Library for Multi-Tenant Demonstration
  const library2 = await prisma.library.upsert({
    where: { code: "LIB-2026-002" },
    update: {},
    create: {
      code: "LIB-2026-002",
      slug: "saraswati-reading-hall",
      name: "Saraswati Reading Hall & Library",
      tagline: "Empowering Students for Civil Services & Competitive Exams",
      ownerName: "Rajesh Patil",
      ownerMobile: "9822334455",
      ownerEmail: "rajesh@saraswatilibrary.com",
      address: "Plot No. 148, Shrinand Plaza, CIDCO Waluj Mahanagar 1",
      city: "Chhatrapati Sambhajinagar",
      state: "Maharashtra",
      pincode: "431136",
      totalSeats: 60,
      status: LibraryStatus.ACTIVE,
      subscriptionTier: SubscriptionTier.STARTER,
      monthlyFee: 1499.00,
      facilities: JSON.stringify(["Quiet Zones", "High-Speed Wi-Fi", "Charging Points", "Filtered Drinking Water"]),
      openingHours: "07:00 AM - 11:00 PM",
    },
  });
  console.log(`✓ Library 2 registered: ${library2.name} (${library2.code})`);

  // 2. Company Subscriptions (ENTERPRENEX PLATFORM REVENUE - Isolated from student fees!)
  await prisma.companySubscription.upsert({
    where: { invoiceNumber: "ENX-SUB-2026-001" },
    update: {},
    create: {
      libraryId: library.id,
      tier: SubscriptionTier.GROWTH,
      amount: 2499.00,
      billingCycle: "MONTHLY",
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: "order_sub_live_001",
      razorpayPaymentId: "pay_sub_live_001",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      invoiceNumber: "ENX-SUB-2026-001",
      notes: "Growth Plan Monthly SaaS License for StudyPlus Shivaji Nagar",
    },
  });

  await prisma.companySubscription.upsert({
    where: { invoiceNumber: "ENX-SUB-2026-002" },
    update: {},
    create: {
      libraryId: library2.id,
      tier: SubscriptionTier.STARTER,
      amount: 1499.00,
      billingCycle: "MONTHLY",
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: "order_sub_live_002",
      razorpayPaymentId: "pay_sub_live_002",
      validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      invoiceNumber: "ENX-SUB-2026-002",
      notes: "Starter Plan Monthly SaaS License for Saraswati Reading Hall",
    },
  });
  console.log("✓ Recorded Company Subscription Revenues (Enterprenex Revenue)");

  // 3. Create or Update Initial Branch under Primary Library
  const branch = await prisma.branch.upsert({
    where: { code: "BR-01" },
    update: {
      libraryId: library.id,
    },
    create: {
      libraryId: library.id,
      name: "Main Branch - Shivaji Nagar",
      code: "BR-01",
      city: "Pune",
      address: "Plot 12, Shivaji Nagar, Near Modern College, Pune, Maharashtra 411005",
      contactPhone: "+91 92268 60060",
      contactEmail: "contact@granthsetu.in",
    },
  });

  console.log(`✓ Branch configured: ${branch.name} (${branch.code}) under Library ${library.name}`);

  // 2. Create Owner and Staff Accounts
  const owner = await prisma.user.upsert({
    where: { mobile: "9876543210" },
    update: {},
    create: {
      branchId: branch.id,
      role: UserRole.OWNER,
      name: "Adhyaksha (Owner)",
      mobile: "9876543210",
      email: "owner@granthsetu.in",
    },
  });

  const staff = await prisma.user.upsert({
    where: { mobile: "9876543211" },
    update: {},
    create: {
      branchId: branch.id,
      role: UserRole.STAFF,
      name: "Desk Officer (Staff)",
      mobile: "9876543211",
      email: "staff@granthsetu.in",
    },
  });

  console.log(`✓ Users created: Owner (${owner.mobile}) and Staff (${staff.mobile})`);

  // 3. Create Standard Shifts
  const shiftsData = [
    {
      name: "Morning Shift",
      shiftType: ShiftType.MORNING,
      startTime: "06:00",
      endTime: "14:00",
      is24Hour: false,
    },
    {
      name: "Afternoon Shift",
      shiftType: ShiftType.AFTERNOON,
      startTime: "14:00",
      endTime: "22:00",
      is24Hour: false,
    },
    {
      name: "Evening Shift",
      shiftType: ShiftType.EVENING,
      startTime: "18:00",
      endTime: "23:00",
      is24Hour: false,
    },
    {
      name: "24-Hour Full Day",
      shiftType: ShiftType.FULL_DAY_24HR,
      startTime: "00:00",
      endTime: "23:59",
      is24Hour: true,
    },
  ];

  const createdShifts = [];
  for (const s of shiftsData) {
    let existingShift = await prisma.shift.findFirst({
      where: { branchId: branch.id, name: s.name },
    });
    if (!existingShift) {
      existingShift = await prisma.shift.create({
        data: {
          branchId: branch.id,
          ...s,
        },
      });
    }
    createdShifts.push(existingShift);
  }

  console.log(`✓ Configured ${createdShifts.length} Library Shifts`);

  // 4. Create Standard Fee Plans
  const feePlansData = [
    {
      name: "Monthly Morning Shift (AC)",
      shiftId: createdShifts[0].id,
      durationDays: 30,
      amount: 1500,
      registrationFee: 200,
    },
    {
      name: "Monthly Afternoon Shift (AC)",
      shiftId: createdShifts[1].id,
      durationDays: 30,
      amount: 1400,
      registrationFee: 200,
    },
    {
      name: "Monthly Evening Shift (AC)",
      shiftId: createdShifts[2].id,
      durationDays: 30,
      amount: 1200,
      registrationFee: 200,
    },
    {
      name: "Monthly 24-Hour Full Access (Premium)",
      shiftId: createdShifts[3].id,
      durationDays: 30,
      amount: 2800,
      registrationFee: 200,
    },
  ];

  for (const plan of feePlansData) {
    const existing = await prisma.feePlan.findFirst({
      where: { branchId: branch.id, name: plan.name },
    });
    if (!existing) {
      await prisma.feePlan.create({
        data: {
          branchId: branch.id,
          ...plan,
        },
      });
    }
  }

  console.log(`✓ Configured ${feePlansData.length} Tariff Fee Plans`);

  // 5. Create 48 Physical Seats (S-01 to S-48)
  console.log("⏳ Checking Physical Seats across Ground & 1st Floor...");
  const existingSeatsCount = await prisma.seat.count({
    where: { branchId: branch.id },
  });

  if (existingSeatsCount < 48) {
    for (let i = existingSeatsCount + 1; i <= 48; i++) {
      const seatNumber = `S-${String(i).padStart(2, "0")}`;
      const section = i <= 24 ? "Ground Floor (Quiet Zone - AC)" : "First Floor (General - AC)";
      const hasLocker = i % 3 === 0;

      await prisma.seat.upsert({
        where: {
          branchId_seatNumber: {
            branchId: branch.id,
            seatNumber,
          },
        },
        update: {},
        create: {
          branchId: branch.id,
          seatNumber,
          section,
          status: SeatStatus.VACANT,
          hasLocker,
          hasChargingPoint: true,
        },
      });
    }
  }

  console.log("✓ Physical Seats verified/created (S-01 to S-48)");

  // 6. Seed Realistic Students with Actual Allocations & Fees
  console.log("⏳ Seeding sample students with desk allocations and fee records...");
  const sampleStudents = [
    {
      regNo: "GS-2026-0001",
      name: "Aditya Prakash Patil",
      mobile: "9822114455",
      parentName: "Prakash Patil",
      parentMobile: "9422001122",
      course: "Competitive exam (UPSC / MPSC)",
      seatNo: "S-08",
      shiftIdx: 0, // Morning
      planIdx: 0,
      feePaid: 1500,
      feeDue: 0,
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      feeStatus: "PAID" as const,
    },
    {
      regNo: "GS-2026-0002",
      name: "Sneha Dilip Deshmukh",
      mobile: "9766223344",
      parentName: "Dilip Deshmukh",
      parentMobile: "9822334455",
      course: "Competitive exam (UPSC / MPSC)",
      seatNo: "S-14",
      shiftIdx: 3, // 24-Hr
      planIdx: 3,
      feePaid: 1500,
      feeDue: 1300,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Due in 4 days
      feeStatus: "PARTIAL" as const,
    },
    {
      regNo: "GS-2026-0003",
      name: "Rohit Ramesh Jadhav",
      mobile: "9890123456",
      parentName: "Ramesh Jadhav",
      parentMobile: "9423123456",
      course: "SSC / Banking",
      seatNo: "S-22",
      shiftIdx: 2, // Evening
      planIdx: 2,
      feePaid: 0,
      feeDue: 1200,
      dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days overdue
      feeStatus: "OVERDUE" as const,
    },
    {
      regNo: "GS-2026-0004",
      name: "Pooja Santosh Sharma",
      mobile: "9822778899",
      parentName: "Santosh Sharma",
      parentMobile: "9422889900",
      course: "NEET / JEE / CET",
      seatNo: "S-05",
      shiftIdx: 0, // Morning
      planIdx: 0,
      feePaid: 1500,
      feeDue: 0,
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      feeStatus: "PAID" as const,
    },
    {
      regNo: "GS-2026-0005",
      name: "Omkar Anant More",
      mobile: "9850112233",
      parentName: "Anant More",
      parentMobile: "9823445566",
      course: "Others",
      seatNo: "S-19",
      shiftIdx: 1, // Afternoon
      planIdx: 1,
      feePaid: 1400,
      feeDue: 0,
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      feeStatus: "PAID" as const,
    },
  ];

  const dbFeePlans = await prisma.feePlan.findMany({ where: { branchId: branch.id } });

  for (const s of sampleStudents) {
    const existing = await prisma.student.findFirst({
      where: { OR: [{ mobile: s.mobile }, { studentRegNo: s.regNo }] },
    });

    let student;
    if (existing) {
      student = await prisma.student.update({
        where: { id: existing.id },
        data: {
          branchId: branch.id,
          studentRegNo: s.regNo,
          fullName: s.name,
          mobile: s.mobile,
          isMobileVerified: true,
          gender: "Male",
          coursePreparingFor: s.course,
          status: "ACTIVE",
        },
      });
    } else {
      student = await prisma.student.create({
        data: {
          branchId: branch.id,
          studentRegNo: s.regNo,
          fullName: s.name,
          mobile: s.mobile,
          isMobileVerified: true,
          gender: "Male",
          coursePreparingFor: s.course,
          isAadhaarVerified: true,
          aadhaarLast4: "4289",
          status: "ACTIVE",
        },
      });
    }

    // Guardian
    await prisma.guardian.upsert({
      where: { id: `g-${student.id}` },
      update: {},
      create: {
        id: `g-${student.id}`,
        studentId: student.id,
        fullName: s.parentName,
        mobile: s.parentMobile,
        relation: "Father",
        isMobileVerified: true,
      },
    });

    // Seat Allocation
    const seat = await prisma.seat.findFirst({
      where: { branchId: branch.id, seatNumber: s.seatNo },
    });

    if (seat) {
      await prisma.seat.update({
        where: { id: seat.id },
        data: { status: SeatStatus.BOOKED },
      });

      const shift = createdShifts[s.shiftIdx];
      await prisma.seatAllocation.upsert({
        where: { id: `alloc-${student.id}` },
        update: {},
        create: {
          id: `alloc-${student.id}`,
          studentId: student.id,
          seatId: seat.id,
          shiftId: shift.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
        },
      });
    }

    // Fee Record
    const plan = dbFeePlans[s.planIdx] || dbFeePlans[0];
    const totalAmt = s.feePaid + s.feeDue;
    const feeRecord = await prisma.studentFee.upsert({
      where: { id: `fee-${student.id}` },
      update: {},
      create: {
        id: `fee-${student.id}`,
        studentId: student.id,
        feePlanId: plan.id,
        totalAmount: totalAmt,
        paidAmount: s.feePaid,
        balanceAmount: s.feeDue,
        dueDate: s.dueDate,
        status: s.feeStatus,
        periodStart: new Date(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Payment if paid
    if (s.feePaid > 0) {
      await prisma.payment.upsert({
        where: { id: `pay-${student.id}` },
        update: {},
        create: {
          id: `pay-${student.id}`,
          studentId: student.id,
          studentFeeId: feeRecord.id,
          amount: s.feePaid,
          mode: PaymentMode.UPI_MANUAL,
          status: PaymentStatus.SUCCESS,
          remarks: "Monthly fee payment",
        },
      });
    }
  }

  console.log("✓ Successfully seeded 5 sample students with allocations and fees!");
  console.log("\n🚀 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

