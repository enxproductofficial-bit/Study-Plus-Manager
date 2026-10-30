import { PrismaClient, UserRole, ShiftType, SeatStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GranthSetu Database...");

  // 1. Create or Find Initial Branch
  const branch = await prisma.branch.upsert({
    where: { code: "BR-01" },
    update: {},
    create: {
      name: "Main Branch - Shivaji Nagar",
      code: "BR-01",
      city: "Pune",
      address: "Plot 12, Shivaji Nagar, Near Modern College, Pune, Maharashtra 411005",
      contactPhone: "+91 92268 60060",
      contactEmail: "contact@granthsetu.in",
    },
  });

  console.log(`✓ Branch configured: ${branch.name} (${branch.code})`);

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
  console.log("⏳ Provisioning 48 Physical Seats across Ground & 1st Floor...");
  for (let i = 1; i <= 48; i++) {
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

  console.log("✓ Successfully created 48 Physical Seats (S-01 to S-48)");
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

