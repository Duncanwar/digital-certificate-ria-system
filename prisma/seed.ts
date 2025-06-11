import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });

  // Create some sample members
  const members = await Promise.all([
    prisma.members.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        address: "123 Main St",
        membershipId: `MEM${Date.now()}`,
      },
    }),
    prisma.members.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phoneNumber: "+0987654321",
        address: "456 Oak Ave",
        membershipId: `MEM${Date.now() + 1}`,
      },
    }),
  ]);

  console.log({ members });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
