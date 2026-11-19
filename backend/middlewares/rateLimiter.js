// Security Middleware: In-Memory Sliding-Window Rate Limiter
// Protects endpoints against Brute Force, Credential Stuffing & DoS

const rateLimits = new Map();

/**
 * Creates an Express rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 15 minutes)
 * @param {number} options.max - Maximum requests allowed per window per IP
 * @param {string} options.message - Error response message
 */
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 15,
  message = "تم تجاوز الحد الأقصى للمحاولات المسموح بها. يرجى الانتظار 15 دقيقة قبل المحاولة مرة أخرى.",
} = {}) => {
  return (req, res, next) => {
    // Determine client IP safely
    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : null) ||
      req.ip ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const now = Date.now();
    const record = rateLimits.get(ip);

    // If no record or time window expired, reset
    if (!record || now - record.startTime > windowMs) {
      rateLimits.set(ip, {
        count: 1,
        startTime: now,
      });
      return next();
    }

    // If limit exceeded, reject with 429
    if (record.count >= max) {
      const remainingSeconds = Math.ceil(
        (windowMs - (now - record.startTime)) / 1000
      );
      return res.status(429).json({
        success: false,
        message,
        retryAfter: remainingSeconds,
      });
    }

    // Increment request count
    record.count += 1;
    next();
  };
};

// Periodic garbage collection for expired IP entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimits.entries()) {
    if (now - data.startTime > 30 * 60 * 1000) {
      rateLimits.delete(ip);
    }
  }
}, 10 * 60 * 1000).unref();

module.exports = {
  authLimiter: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Max 20 auth attempts per IP per 15 mins
    message:
      "تم تجاوز الحد الأقصى لمحاولات الدخول/التسجيل. لدواعي الأمان، يرجى الانتظار 15 دقيقة ثم المحاولة مجدداً.",
  }),
  createRateLimiter,
};
