const mongoose = require("mongoose");

/**
 * Database Connection Handler (MongoDB)
 * 
 * - process: الكائن العام المدمج في Node.js للتحكم في بيئة التشغيل.
 * - process.env: المتغيرات البيئية المستدعاة من ملف .env.
 * - process.exit(1): إنهاء فوري لعملية الخادم (Process) مع كود فشل (1).
 *   (تنبيه: يجب ألا توضع خارج الـ catch حتى لا تغلق السيرفر عند نجاح الاتصال أو استمرار عمل SQL).
 */
const dbConnection = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DB_URL;
    if (!uri) {
      console.warn("⚠️ تنبيه: لم يتم العثور على MONGO_URI أو DB_URL في ملف .env");
      return;
    }

    // تعيين مهلة 5 ثوانٍ للاتصال حتى لا يعلق السيرفر في حال عدم تشغيل خدمة MongoDB محلياً
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح");
  } catch (error) {
    console.warn(`⚠️ تعذر الاتصال بـ MongoDB: ${error.message}`);
    console.info("ℹ️ إذا كنت تستخدم قاعدة بيانات SQL (SQLite / PostgreSQL) للبلاغات والتحديات الصناعية، يستمر الخادم في العمل بشكل طبيعي.");
  }
};

module.exports = dbConnection;
