const mongoose = require("mongoose");
const Factory = require("../models/User");
const mockStore = require("../data/mockStore");

// @desc    Get all registered facilities for Admin with optional status/search filters
// @route   GET /api/admin/factories
// @access  Private (Admin only)
const getFactories = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    // Use MockStore if DB is not connected (e.g. testing mode)
    if (mongoose.connection.readyState !== 1) {
      const factories = mockStore.getFactories(status, search);
      return res.status(200).json({
        success: true,
        count: factories.length,
        factories,
      });
    }

    const filter = { role: "factory" };

    // Status filter
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.accountStatus = status;
    }

    // Search filter across factory name, email, phone, or taxId
    if (search && typeof search === "string" && search.trim()) {
      const cleanSearch = search.trim();
      const regex = new RegExp(cleanSearch, "i");
      filter.$or = [
        { factoryName: regex },
        { "contactInfo.email": regex },
        { "contactInfo.phone": regex },
        { taxId: regex },
        { "location.industrialZone": regex },
        { "location.city": regex },
        { "location.governorate": regex },
      ];
    }

    const factories = await Factory.find(filter)
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: factories.length,
      factories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary statistics for Admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const stats = mockStore.getStats();
      return res.status(200).json({
        success: true,
        stats,
      });
    }

    const total = await Factory.countDocuments({ role: "factory" });
    const pending = await Factory.countDocuments({
      role: "factory",
      accountStatus: "pending",
    });
    const approved = await Factory.countDocuments({
      role: "factory",
      accountStatus: "approved",
    });
    const rejected = await Factory.countDocuments({
      role: "factory",
      accountStatus: "rejected",
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authorize / Update facility accountStatus (pending -> approved / rejected)
// @route   PATCH /api/admin/factories/:id/status
// @access  Private (Admin only)
const updateFactoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, auditNotes, rejectionReason } = req.body;

    // Validate target status
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الحساب المطلوبة غير صالحة. الحالات المسموحة: pending, approved, rejected",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const factory = mockStore.updateFactoryStatus(id, status, auditNotes, rejectionReason);
      if (!factory) {
        return res.status(404).json({
          success: false,
          message: "لم يتم العثور على المنشأة الصناعية المحددة",
        });
      }
      const statusArabic =
        status === "approved"
          ? "معتمد وموثق"
          : status === "rejected"
          ? "مرفوض"
          : "قيد المراجعة والاعتماد";
      return res.status(200).json({
        success: true,
        message: `تم تحديث حالة حساب المنشأة بنجاح إلى: ${statusArabic}`,
        factory,
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "معرّف المنشأة المطلوب غير صحيح",
      });
    }

    // Validate target status
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الحساب المطلوبة غير صالحة. الحالات المسموحة: pending, approved, rejected",
      });
    }

    const updateFields = { accountStatus: status };
    if (typeof auditNotes === "string") updateFields.auditNotes = auditNotes.trim();
    if (typeof rejectionReason === "string") updateFields.rejectionReason = rejectionReason.trim();
    if (status === "approved") {
      updateFields.approvedAt = new Date();
    }

    // Update status safely using findOneAndUpdate
    const factory = await Factory.findOneAndUpdate(
      { _id: id, role: "factory" },
      { $set: updateFields },
      { new: true }
    ).select("-password -__v");

    if (!factory) {
      return res.status(404).json({
        success: false,
        message: "لم يتم العثور على المنشأة الصناعية المحددة",
      });
    }

    const statusArabic =
      status === "approved"
        ? "معتمد وموثق"
        : status === "rejected"
        ? "مرفوض"
        : "قيد المراجعة والاعتماد";

    res.status(200).json({
      success: true,
      message: `تم تحديث حالة حساب المنشأة بنجاح إلى: ${statusArabic}`,
      factory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFactories,
  getStats,
  updateFactoryStatus,
};
