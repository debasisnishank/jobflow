const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log("Create Admin Account\n");

    const email = await question("Enter admin email: ");
    if (!email) {
      console.error("Email is required");
      process.exit(1);
    }

    const name = await question("Enter admin name (default: Admin): ") || "Admin";
    
    const password = await question("Enter admin password: ");
    if (!password || password.length < 6) {
      console.error("Password is required and must be at least 6 characters");
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      const update = await question(
        `User '${normalizedEmail}' already exists. Update to admin? (y/n): `
      );
      
      if (update.toLowerCase() === "y") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: "admin",
            password: hashedPassword,
            name: name,
          },
        });
        console.log(`✓ Updated user '${normalizedEmail}' to admin role`);
      } else {
        console.log("Cancelled.");
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name,
          password: hashedPassword,
          role: "admin",
        },
      });
      console.log(`✓ Created admin user: ${normalizedEmail}`);
    }

    console.log("\n✓ Admin account created successfully!");
    console.log(`You can now login at /admin with email: ${normalizedEmail}`);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
