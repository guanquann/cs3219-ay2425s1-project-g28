import bcrypt from "bcrypt";
import { connectToDB, createUser, findUserByEmail } from "../model/repository";

export async function seedAdminAccount() {
  await connectToDB();

  const adminUsername = process.env.ADMIN_USERNAME || "administrator";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASSWORD
  ) {
    console.error(
      "Admin account not seeded in .env. Using default admin account credentials (username: administrator, email: admin@gmail.com, password: Admin@123)"
    );
  }

  try {
    const existingAdmin = await findUserByEmail(adminEmail);
    if (existingAdmin) {
      console.error("Admin account already exists in the database.");
      process.exit(1);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminPassword, salt);

    await createUser(adminUsername, adminEmail, hashedPassword, true);

    console.log("Admin account created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin account:", err);
    process.exit(1);
  }
}

seedAdminAccount();
