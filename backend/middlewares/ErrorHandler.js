// Centralized Security-Aware Error Handler
const errorHandler = (err, req, res, next) => {
  // Log error internally for debugging (without leaking sensitive data)
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "حدث خطأ غير متوقع في الخادم.";

  // 1. Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "الحقل";
    message = `البيانات المدخلة (${field}) مسجلة مسبقاً في النظام.`;
  }

  // 2. Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join("، ");
  }

  // 3. Handle Mongoose Invalid ObjectId CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = "المعرّف المطلوب غير صالح.";
  }

  // 4. In production, include error details in response for debugging Vercel issues
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = err.message || "حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.VERCEL ? { errorDetail: err.message, stack: err.stack?.split("\n")[1] } : {}),
  });
};

module.exports = errorHandler;
