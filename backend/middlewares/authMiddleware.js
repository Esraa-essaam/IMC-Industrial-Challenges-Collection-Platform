const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Factory = require("../models/User");
const mockStore = require("../data/mockStore");

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("غير مصرح بالوصول. لم يتم تقديم رمز التحقق (Token).");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "imc_jwt_secret_key_2026",
      { algorithms: ["HS256"] }
    );

    let factory;
    if (mongoose.connection.readyState === 1) {
      factory = await Factory.findById(decoded.id).select("-password -__v");
    } else {
      factory = mockStore.findFactoryById(decoded.id);
    }

    if (!factory) {
      const error = new Error("المستخدم المرتبط بهذه الجلسة لم يعد مسجلاً في المنظومة.");
      error.statusCode = 401;
      return next(error);
    }

    if (factory.role !== "admin" && factory.accountStatus !== "approved") {
      const error = new Error(
        factory.accountStatus === "pending"
          ? "طلب إنشاء الحساب قيد الفحص والتدقيق من إدارة مركز تحديث الصناعة (Admin Checker). يرجى الانتظار لحين اعتماد الحساب وتفعيله رسمياً."
          : "تم رفض هذا الحساب أو تعليقه من قِبل إدارة المنظومة."
      );
      error.statusCode = 403;
      return next(error);
    }

    req.user = factory;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const expError = new Error("انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مجدداً.");
      expError.statusCode = 401;
      return next(expError);
    }

    if (error.name === "JsonWebTokenError") {
      const jwtError = new Error("رمز التحقق غير صالح أو تالف.");
      jwtError.statusCode = 401;
      return next(jwtError);
    }

    error.statusCode = 401;
    next(error);
  }
};

// Grant access to specific roles (e.g. "admin", "factory")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(
        `غير مصرح لحسابك برتبة (${req.user ? req.user.role : "غير محدد"}) بالوصول إلى هذا الإجراء.`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
