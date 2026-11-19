const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Factory = require("../models/User");

/**
 * Seeder to create 2 primary test accounts (Admin & User/Factory)
 * plus an optional pending user for testing Admin approval.
 */
const seedTestUsers = async () => {
  const uri =
    process.env.MONGO_URI ||
    process.env.DB_URL ||
    "mongodb://127.0.0.1:27017/imc_database";

  try {
    console.log("========================================================");
    console.log("       INITIALIZING TEST USERS SEEDING PROCESS          ");
    console.log("========================================================");
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Database connected successfully.\n");

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash("Admin123!", salt);
    const userPasswordHash = await bcrypt.hash("User123!", salt);

    // 1. Admin Account (دور مسؤول المنصة)
    const adminData = {
      factoryName: "إدارة المنظومة الصناعية - IMC",
      taxId: "ADMIN-IMC-001",
      taxCardImage: {
        fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
      },
      commercialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
      },
      industrialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
      },
      contactInfo: {
        email: "admin@imc.gov.eg",
        phone: "01000000000",
      },
      password: adminPasswordHash,
      role: "admin",
      accountStatus: "approved",
      location: {
        governorate: "القاهرة",
        city: "مدينة نصر",
        industrialZone: "المقر الرئيسي لمركز تحديث الصناعة",
      },
    };

    await Factory.findOneAndUpdate(
      { "contactInfo.email": adminData.contactInfo.email },
      adminData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Admin account configured: admin@imc.gov.eg");

    // 2. Regular User Account (دور المنشأة الصناعية / المستخدم) - معتمد ونشط
    const regularUserData = {
      factoryName: "شركة النيل للصناعات الهندسية",
      taxId: "TAX-10001",
      taxCardImage: {
        fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
      },
      commercialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
      },
      industrialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
      },
      contactInfo: {
        email: "user@factory.com",
        phone: "01012345678",
      },
      password: userPasswordHash,
      role: "factory",
      accountStatus: "approved",
      location: {
        governorate: "القاهرة",
        city: "مدينة بدر",
        industrialZone: "المنطقة الصناعية - الروبيكي",
      },
    };

    await Factory.findOneAndUpdate(
      { "contactInfo.email": regularUserData.contactInfo.email },
      regularUserData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Regular User account configured: user@factory.com");

    // Also update existing nilefood if exists to match User123!
    await Factory.findOneAndUpdate(
      { "contactInfo.email": "nilefood.test@example.com" },
      {
        password: userPasswordHash,
        accountStatus: "approved",
        role: "factory",
      }
    );

    // 3. Pending User Account (حساب تحت المراجعة - لتجربة فحص واعتماد الأدمن له)
    const pendingUserData = {
      factoryName: "مصنع الأمل للغزل والنسيج",
      taxId: "TAX-20002",
      taxCardImage: {
        fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      },
      commercialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      },
      industrialRegImage: {
        fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
      },
      contactInfo: {
        email: "pending@factory.com",
        phone: "01123456789",
      },
      password: userPasswordHash,
      role: "factory",
      accountStatus: "pending",
      location: {
        governorate: "الغربية",
        city: "المحلة الكبرى",
        industrialZone: "المنطقة الصناعية الأولى",
      },
    };

    await Factory.findOneAndUpdate(
      { "contactInfo.email": pendingUserData.contactInfo.email },
      pendingUserData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Pending User account configured: pending@factory.com");

    console.log("\n========================================================");
    console.log("             TEST ACCOUNTS READY FOR USE                ");
    console.log("========================================================");
    console.log("1. ADMIN ACCOUNT (مسؤول المنظومة):");
    console.log("   - البريد الإلكتروني: admin@imc.gov.eg");
    console.log("   - كلمة المرور:       Admin123!");
    console.log("   - الدور (Role):      admin");
    console.log("   - الصلاحيات:         لوحة المشرفين، مراجعة واعتماد المنشآت (User Validation)، الإحصائيات");
    console.log("\n2. USER ACCOUNT (المنشأة الصناعية - معتمد ونشط):");
    console.log("   - البريد الإلكتروني: user@factory.com");
    console.log("   - كلمة المرور:       User123!");
    console.log("   - الدور (Role):      factory (المستخدم العادي)");
    console.log("   - الصلاحيات:         لوحة المنشأة، تقديم بلاغ تحدٍ صناعي جديد، سجل البلاغات");
    console.log("\n3. BONUS - PENDING USER (منشأة قيد المراجعة لتجربة الأدمن):");
    console.log("   - البريد الإلكتروني: pending@factory.com");
    console.log("   - كلمة المرور:       User123!");
    console.log("   - الحالة:            pending (يظهر في قائمة التحقق للأدمن لاعتماده)");
    console.log("========================================================\n");

  } catch (error) {
    console.error("❌ Error during test users seeding:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

if (require.main === module) {
  seedTestUsers().then(() => {
    process.exit(0);
  });
}

module.exports = seedTestUsers;
