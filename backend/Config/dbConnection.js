const mongoose = require("mongoose");

let isConnecting = false;

/**
 * Database Connection Handler (MongoDB)
 */
const dbConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;

  try {
    isConnecting = true;
    const uri = process.env.MONGO_URI || process.env.DB_URL;
    if (!uri) {
      console.warn("⚠️ تنبيه: لم يتم العثور على MONGO_URI أو DB_URL في ملف .env");
      return;
    }

    // على Vercel: إذا كان الرابط يشير إلى localhost أو 127.0.0.1 فإنه لن يعمل ويجب استخدام قاعدة بيانات سحابية مثل Atlas
    if (process.env.VERCEL && (uri.includes("127.0.0.1") || uri.includes("localhost"))) {
      console.warn("⚠️ Vercel Environment Notice: MONGO_URI points to localhost. Please configure a cloud MongoDB Atlas URI in Vercel Settings.");
      return;
    }

    // تعيين مهلة 5 ثوانٍ للاتصال حتى لا يعلق السيرفر في حال عدم تشغيل خدمة MongoDB محلياً
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Don't buffer if connection fails
    });
    console.log("✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح");
  } catch (error) {
    console.warn(`⚠️ تعذر الاتصال بـ MongoDB: ${error.message}`);
    console.info("ℹ️ إذا كنت تستخدم قاعدة بيانات SQL (SQLite / PostgreSQL) للبلاغات والتحديات الصناعية، يستمر الخادم في العمل بشكل طبيعي.");
  } finally {
    isConnecting = false;
  }
};

module.exports = dbConnection;
