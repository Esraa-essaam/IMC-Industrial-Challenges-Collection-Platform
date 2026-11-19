const express = require("express");
const router = express.Router();

const {
  getFactories,
  getStats,
  updateFactoryStatus,
} = require("../Controllers/adminController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// All routes in this router require authentication and "admin" role
router.use(protect, authorize("admin"));

// Statistics overview
router.get("/stats", getStats);

// List facilities (with optional ?status= & ?search=)
router.get("/factories", getFactories);

// Authorize / Update status of a facility
router.patch("/factories/:id/status", updateFactoryStatus);

module.exports = router;
