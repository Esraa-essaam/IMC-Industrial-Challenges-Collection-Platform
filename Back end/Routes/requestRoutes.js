const express = require("express");
const router = express.Router();
const {
  submitRequest,
  getMyRequests,
  getRequestById,
  getAllRequests,
} = require("../Controllers/requestController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// All request operations require authentication
router.use(protect);

// Factory: Submit new request
router.post("/", submitRequest);

// Factory: Get current user's submitted requests
router.get("/my", getMyRequests);

// Admin: Get all requests across factories
router.get("/all", authorize("admin"), getAllRequests);

// Get specific request by ID
router.get("/:id", getRequestById);

module.exports = router;

