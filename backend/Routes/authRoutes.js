const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
} = require("../Controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimiter");

// Public routes (protected by Rate Limiter against Brute Force & DoS)
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/logout", logout);

// Protected routes (Requires Bearer JWT token)
router.get("/me", protect, getMe);

module.exports = router;
