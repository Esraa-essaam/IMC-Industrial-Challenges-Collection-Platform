const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Factory = require("../models/User");

/**
 * Seed Admin Account for IMC Industrial Platform
 */
const seedAdmin = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.DB_URL ||
    "mongodb://127.0.0.1:27017/imc_database";

  const adminCredentials = {
    email: (process.env.ADMIN_EMAIL || "admin@imc.gov.eg").toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || "Admin123!",
    name: process.env.ADMIN_NAME || "إدارة المنظومة الصناعية - IMC",
    phone: process.env.ADMIN_PHONE || "01000000000",
  };

  try {
    console.log("========================================================");
    console.log("         INITIALIZING IMC ADMIN SEEDING PROCESS         ");
    console.log("========================================================");
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log("Database connected successfully.\n");

    // Check if an account with this email already exists
    let admin = await Factory.findOne({
      "contactInfo.email": adminCredentials.email,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

    if (admin) {
      console.log(`Account with email [${adminCredentials.email}] already exists.`);
      console.log("Ensuring administrator privileges (role: 'admin', accountStatus: 'approved')...");

      admin.role = "admin";
      admin.accountStatus = "approved";
      admin.password = hashedPassword;
      admin.factoryName = adminCredentials.name;
      if (!admin.taxCardImage || !admin.taxCardImage.fileUrl) {
        admin.taxCardImage = {
          fileUrl: "https://imc.gov.eg/assets/official-admin-stamp.png",
        };
      }
      if (!admin.taxId) {
        admin.taxId = "ADMIN-IMC-001";
      }
      if (!admin.location || !admin.location.governorate) {
        admin.location = {
          governorate: "القاهرة",
          city: "مدينة نصر",
          industrialZone: "المقر الرئيسي لمركز تحديث الصناعة",
        };
      }
      await admin.save();
      console.log("Admin account successfully updated!");
    } else {
      admin = await Factory.create({
        factoryName: adminCredentials.name,
        taxId: "ADMIN-IMC-001",
        taxCardImage: {
          fileUrl: "https://imc.gov.eg/assets/official-admin-stamp.png",
        },
        contactInfo: {
          email: adminCredentials.email,
          phone: adminCredentials.phone,
        },
        password: hashedPassword,
        role: "admin",
        accountStatus: "approved",
        location: {
          governorate: "القاهرة",
          city: "مدينة نصر",
          industrialZone: "المقر الرئيسي لمركز تحديث الصناعة",
        },
      });
      console.log("Admin account created successfully!");
    }

    console.log("\n========================================================");
    console.log("           ADMIN ACCOUNT READY FOR LOGIN               ");
    console.log("========================================================");
    console.log(`  Role:           ${admin.role}`);
    console.log(`  Authority Name: ${admin.factoryName}`);
    console.log(`  Email:          ${adminCredentials.email}`);
    console.log(`  Password:       ${adminCredentials.password}`);
    console.log(`  Account Status: ${admin.accountStatus}`);
    console.log("========================================================\n");
    console.log("You can now sign in at the front end with the credentials above.\n");

  } catch (error) {
    console.error("Error during admin seeding:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

if (require.main === module) {
  seedAdmin().then(() => {
    process.exit(0);
  });
}

module.exports = seedAdmin;
