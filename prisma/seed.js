const { STATUS_DATA, JOB_SOURCES } = require("../src/lib/data/seedData");

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedUser() {
  try {
    const email = process.env.USER_EMAIL || "admin@jobflow.local";
    const password = await bcrypt.hash(process.env.USER_PASSWORD || "Admin123!", 10);
    // Normalize email to match how it's stored during signup (lowercase + trim)
    const normalizedEmail = email ? email.toLowerCase().trim() : email;
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: "Admin",
          password,
          role: "admin",
        },
      });
      console.log("Seeded new admin user: ", { email: normalizedEmail, role: "admin" });
    } else {
      if ((existingUser.role || "").toLowerCase() !== "admin") {
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: { role: "admin" },
        });
      }
      console.log("Admin user already exists or was promoted: ", { email: normalizedEmail, role: "admin" });
    }
  } catch (error) {
    console.error("Error seeding user: ", error);
    throw error;
  }
}

async function seedStatus() {
  try {
    const statuses = STATUS_DATA;
    for (const status of statuses) {
      // Check if the status already exists
      const existingStatus = await prisma.jobStatus.findUnique({
        where: {
          value: status.value,
        },
      });

      // If the status does not exist, create it
      if (!existingStatus) {
        await prisma.jobStatus.create({
          data: status,
        });
      }
    }
    console.log("Seeded statuses");
  } catch (error) {
    console.error("Error seeding status: ", error);
    throw error;
  }
}

async function seedJobSouces() {
  try {
    const sources = JOB_SOURCES;
    for (const source of sources) {
      const { label, value } = source;
      await prisma.jobSource.upsert({
        where: {
          value,
        },
        update: { label, value },
        create: { label, value },
      });
    }
    console.log("Seeded job sources");
  } catch (error) {
    console.error("Error seeding job sources: ", error);
    throw error;
  }
}

async function main() {
  await seedUser();
  await seedStatus();
  await seedJobSouces();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
