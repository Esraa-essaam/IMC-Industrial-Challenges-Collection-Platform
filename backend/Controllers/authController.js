const Factory = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mockStore = require("../data/mockStore");

// Strict Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper to strip HTML / script injection characters
const sanitize = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
};

// Generate JWT Token helper (expires in 7d, minimal payload)
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "imc_jwt_secret_key_2026",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      algorithm: "HS256",
    }
  );
};

// Dummy hash for constant-time comparison when email is not found
const DUMMY_HASH = "$2a$10$e84W/3J8BqY6oHqR8K3VXe6hJ4cK5W1tG0F9E8D7C6B5A4z3y2x1w";

// @desc    Register a new Factory / User
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const {
      factoryName,
      email,
      password,
      phone,
      taxId,
      location,
      industrialActivityId,
      taxCardImage,
      commercialRegImage,
      industrialRegImage,
    } = req.body;

    // 1. Strict Type & Presence Validations
    if (
      typeof factoryName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !factoryName.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى توفير اسم المصنع، البريد الإلكتروني، وكلمة المرور بشكل صحيح",
      });
    }

    // 2. Email format validation
    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail) || normalizedEmail.length > 255) {
      return res.status(400).json({
        success: false,
        message: "صيغة البريد الإلكتروني غير صحيحة",
      });
    }

    // 3. Password constraints (min 6, max 128 chars)
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "يجب أن تكون كلمة المرور بين 6 و 128 حرفاً",
      });
    }

    // 4. Check if factory already exists by email (DB or MockStore)
    let existingFactory;
    if (mongoose.connection.readyState === 1) {
      existingFactory = await Factory.findOne({
        "contactInfo.email": normalizedEmail,
      });
    } else {
      existingFactory = mockStore.findFactoryByEmail(normalizedEmail);
    }

    if (existingFactory) {
      return res.status(409).json({
        success: false,
        message: "البريد الإلكتروني مسجل مسبقاً في المنظومة",
      });
    }

    // 5. Hash password with bcrypt (cost factor 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Validate the 3 required documents (Strictly image files only)
    const validateDocImage = (img, label) => {
      const raw =
        typeof img === "string"
          ? img.trim()
          : typeof img?.fileUrl === "string"
          ? img.fileUrl.trim()
          : "";

      if (!raw || raw.includes("default-tax-card.png")) {
        return {
          valid: false,
          error: `مستند صورة «${label}» مطلوب كملف صورة لإتمام التسجيل.`,
        };
      }

      const isImage =
        raw.startsWith("data:image/") ||
        /\.(png|jpe?g|webp|gif|bmp)(\?.*)?$/i.test(raw);

      if (!isImage) {
        return {
          valid: false,
          error: `مستند «${label}»: يُقبل فقط رفع ملف صورة (PNG, JPG, JPEG, WEBP). الروابط والملفات الأخرى غير مقبولة.`,
        };
      }

      return { valid: true, url: raw };
    };

    // 1. البطاقة الضريبية (Tax Card)
    const taxCardCheck = validateDocImage(taxCardImage, "البطاقة الضريبية");
    if (!taxCardCheck.valid) {
      return res.status(400).json({ success: false, message: taxCardCheck.error });
    }

    // 2. السجل التجاري (Commercial Registration)
    const commercialRegCheck = validateDocImage(commercialRegImage, "السجل التجاري");
    if (!commercialRegCheck.valid) {
      return res.status(400).json({ success: false, message: commercialRegCheck.error });
    }

    // 3. السجل الصناعي (Industrial Registry)
    const industrialRegCheck = validateDocImage(industrialRegImage, "السجل الصناعي");
    if (!industrialRegCheck.valid) {
      return res.status(400).json({ success: false, message: industrialRegCheck.error });
    }

    // 7. Prevent Mass Assignment: Strictly hardcode default security roles
    const safeLocation = {
      governorate: sanitize(location?.governorate || ""),
      city: sanitize(location?.city || ""),
      industrialZone: sanitize(location?.industrialZone || ""),
    };

    let newFactory;
    if (mongoose.connection.readyState === 1) {
      newFactory = await Factory.create({
        factoryName: sanitize(factoryName),
        taxId: taxId ? sanitize(String(taxId)) : undefined,
        taxCardImage: {
          fileUrl: taxCardCheck.url,
        },
        commercialRegImage: {
          fileUrl: commercialRegCheck.url,
        },
        industrialRegImage: {
          fileUrl: industrialRegCheck.url,
        },
        industrialActivityId: industrialActivityId || undefined,
        location: safeLocation,
        contactInfo: {
          email: normalizedEmail,
          phone: phone ? sanitize(String(phone)) : "",
        },
        password: hashedPassword,
        // Security: enforce default unprivileged role & pending status (No user active without Admin Accept)
        role: "factory",
        accountStatus: "pending",
      });
    } else {
      newFactory = mockStore.createFactory({
        factoryName: sanitize(factoryName),
        taxId: taxId ? sanitize(String(taxId)) : undefined,
        taxCardImage: {
          fileUrl: taxCardCheck.url,
        },
        commercialRegImage: {
          fileUrl: commercialRegCheck.url,
        },
        industrialRegImage: {
          fileUrl: industrialRegCheck.url,
        },
        location: safeLocation,
        contactInfo: {
          email: normalizedEmail,
          phone: phone ? sanitize(String(phone)) : "",
        },
        password: hashedPassword,
        role: "factory",
        accountStatus: "pending",
      });
    }

    // Remove password and internal metadata from response
    const factoryData = newFactory.toObject ? newFactory.toObject() : { ...newFactory };
    delete factoryData.password;
    delete factoryData.__v;

    // Do NOT issue an active JWT token upon registration — account must be reviewed and accepted by Admin first
    res.status(201).json({
      success: true,
      requiresApproval: true,
      message:
        "تم تسجيل طلب المنشأة بنجاح وهو قيد الفحص والمراجعة من قِبل إدارة مركز تحديث الصناعة. سيتم تفعيل حسابك فور مراجعته واعتماده.",
      factory: factoryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login Factory / User
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Strict Type Validations to prevent NoSQL injection
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "يرجى إدخال كل من البريد الإلكتروني وكلمة المرور",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Length limit to prevent computational DoS
    if (normalizedEmail.length > 255 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "بيانات الاعتماد غير صالحة",
      });
    }

    // 2. Query factory (DB or MockStore)
    let factory;
    if (mongoose.connection.readyState === 1) {
      factory = await Factory.findOne({
        "contactInfo.email": normalizedEmail,
      }).select("+password");
    } else {
      factory = mockStore.findFactoryByEmail(normalizedEmail);
    }

    // 3. Timing Attack Mitigation
    // If user does not exist, run a dummy bcrypt compare to keep response time uniform
    if (!factory) {
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // 4. Verify password
    const isMatch = await bcrypt.compare(password, factory.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // 5. Verification Barrier: No user can access or log in without prior Admin Accept
    if (factory.role !== "admin" && factory.accountStatus !== "approved") {
      if (factory.accountStatus === "pending") {
        return res.status(403).json({
          success: false,
          accountStatus: "pending",
          message:
            "طلب الحساب قيد الفحص والمراجعة من قِبل إدارة مركز تحديث الصناعة (Admin Checker). لن تتمكن من الدخول حتى يتم مراجعة بياناتك وصورة البطاقة الضريبية واعتماد الحساب وتفعيله رسمياً.",
        });
      }
      if (factory.accountStatus === "rejected") {
        return res.status(403).json({
          success: false,
          accountStatus: "rejected",
          message:
            "تم رفض طلب تسجيل المنشأة من إدارة المركز لعدم مطابقة الشروط أو المستندات المطلوبة. يرجى التواصل مع إدارة المركز لمزيد من التوضيح.",
        });
      }
      return res.status(403).json({
        success: false,
        accountStatus: factory.accountStatus,
        message: "حساب المنشأة غير مفعل حالياً. يرجى مراجعة إدارة المنظومة.",
      });
    }

    // 6. Generate secure JWT token
    const token = generateToken(factory._id, factory.role);

    // Remove password and sensitive metadata from response
    const factoryData = factory.toObject ? factory.toObject() : { ...factory };
    delete factoryData.password;
    delete factoryData.__v;

    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      factory: factoryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in Factory / User Profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const factoryData = req.user.toObject ? req.user.toObject() : req.user;
    delete factoryData.password;
    delete factoryData.__v;

    res.status(200).json({
      success: true,
      factory: factoryData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (Stateless confirmation)
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "تم تسجيل الخروج بنجاح",
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
