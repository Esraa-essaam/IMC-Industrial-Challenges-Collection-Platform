const { ProblemRequest, RequestFactoryLink } = require("../models/sql");
const { Op } = require("sequelize");
const mockStore = require("../data/mockStore");

/**
 * Generate a clean, unique request reference ID like REQ-2026-1042
 */
async function generateRequestId() {
  const currentYear = new Date().getFullYear();
  const prefix = `REQ-${currentYear}-`;

  // Find latest request of current year to increment
  const latest = await ProblemRequest.findOne({
    where: {
      requestId: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  if (latest && latest.requestId) {
    const parts = latest.requestId.split("-");
    const num = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(num)) {
      return `${prefix}${String(num + 1).padStart(4, "0")}`;
    }
  }

  // Fallback initial
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}

/**
 * POST /api/requests
 * Submit a new industrial challenge or technical request into PostgreSQL
 */
exports.submitRequest = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body || {};

    if (!body.requestType) {
      return res.status(400).json({
        success: false,
        message: "نوع الطلب مطلوب (تحدٍ، تحسين، فكرة، تعميق تصنيع، خدمات معامل)",
      });
    }

    if (!body.consent) {
      return res.status(400).json({
        success: false,
        message: "يجب الموافقة والإقرار بصحة البيانات المسجلة لإتمام تقديم الطلب",
      });
    }

    const factoryId =
      body.factoryId ||
      user?.taxId ||
      user?._id?.toString() ||
      "FAC-" + Math.floor(1000 + Math.random() * 9000);

    const requestId = await generateRequestId();

    // Map payload into PostgreSQL record attributes
    const requestData = {
      requestId,
      factoryId,
      affectedFactoryIds: body.affectedFactoryIds || null,
      affectedFactoryCount: body.affectedFactoryCount || 1,
      companyName: body.companyName || user?.factoryName || "غير محدد",
      factoryName: body.factoryName || user?.factoryName || "المنشأة الصناعية",
      industrialSector: body.industrialSector || user?.industrialSector || null,
      region: body.region || user?.location?.region || null,
      governorate: body.governorate || user?.location?.governorate || null,
      city: body.city || user?.location?.city || null,
      factorySize: body.factorySize || user?.factorySize || "متوسطة",
      imcClient: body.imcClient || (user?.imcClientId ? "نعم" : "لا"),

      requestType: body.requestType,

      // Page 2 Fields
      reportedAreaCode: body.reportedAreaCode || null,
      reportedAreaLabel: body.reportedAreaLabel || null,
      reportedSymptomCode: body.reportedSymptomCode || null,
      reportedSymptomLabel: body.reportedSymptomLabel || null,
      symptomDetail: body.symptomDetail || null,
      freeDescription: body.freeDescription || null,

      opportunityType: body.opportunityType || null,
      opportunityTypeLabel: body.opportunityTypeLabel || null,
      subjectName: body.subjectName || null,

      labKnowledge: body.labKnowledge || null,
      labTestAreaCode: body.labTestAreaCode || null,
      labTestAreaLabel: body.labTestAreaLabel || null,
      labTestCode: body.labTestCode || null,
      labTestLabel: body.labTestLabel || null,
      labTestName: body.labTestName || null,
      labGoalCode: body.labGoalCode || null,
      labGoalLabel: body.labGoalLabel || null,
      labSubjectMode: body.labSubjectMode || null,
      labMaterialFamily: body.labMaterialFamily || null,
      labMaterialType: body.labMaterialType || null,
      labProductFamily: body.labProductFamily || null,
      labProductType: body.labProductType || null,
      labOtherSubject: body.labOtherSubject || null,
      labStandard: body.labStandard || null,
      labUsage: body.labUsage || null,
      labUsageLabel: body.labUsageLabel || null,
      labSampleCount: body.labSampleCount ? parseInt(body.labSampleCount, 10) : null,

      // Page 3 Fields
      frequency: body.frequency || null,
      frequencyLabel: body.frequencyLabel || null,
      affectedScope: body.affectedScope || "line",
      affectedScopeLabel: body.affectedScopeLabel || null,
      impactCodes: body.impactCodes || [],
      impactLabels: body.impactLabels || [],
      expectedBenefitCodes: body.expectedBenefitCodes || [],
      expectedBenefitLabels: body.expectedBenefitLabels || [],
      desiredOutcome: body.desiredOutcome || null,
      desiredOutcomeLabel: body.desiredOutcomeLabel || null,
      metricContext: body.metricContext || null,
      metricType: body.metricType || null,
      metricTypeLabel: body.metricTypeLabel || null,
      metricValue: body.metricValue ? parseFloat(body.metricValue) : null,
      metricUnit: body.metricUnit || null,
      metricPeriod: body.metricPeriod || null,

      // Status
      imcReviewStatus: "AwaitingReview",
      consent: true,
      dataType: "DEMO",
      submittedAt: new Date(),
    };

    const newRequest = await ProblemRequest.create(requestData);

    // Save multi-factory links if applicable
    if (
      body.affectedScope === "multi" &&
      Array.isArray(body.additionalFactories) &&
      body.additionalFactories.length > 0
    ) {
      const linkPromises = body.additionalFactories.map((fac) =>
        RequestFactoryLink.create({
          requestId: newRequest.requestId,
          factoryId: fac.factoryId || fac.id || "N/A",
          factoryName: fac.factoryName || fac.name || "فرع مصنع",
          governorate: fac.governorate || null,
          city: fac.city || null,
        })
      );
      await Promise.all(linkPromises);
    }

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الطلب الصناعي بنجاح في قاعدة البيانات وتوليد رقم البلاغ الرسمي",
      data: newRequest,
    });
  } catch (error) {
    console.warn("SQL database offline or failed, falling back to mockStore for request:", error.message);
    const fallbackRequest = mockStore.createRequest({
      factoryId: req.user?.taxId || req.user?._id || "FAC-1001",
      companyName: req.body?.companyName || req.user?.factoryName || "المنشأة الصناعية",
      factoryName: req.body?.factoryName || req.user?.factoryName || "المنشأة الصناعية",
      requestType: req.body?.requestType || "تحديات وأعطال فنية",
      requestDetails: req.body?.requestDetails || "",
      governorate: req.body?.governorate || req.user?.location?.governorate || "القاهرة",
      city: req.body?.city || req.user?.location?.city || "مدينة بدر",
      status: "قيد الدراسة والتحليل",
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "تم تسجيل الطلب الصناعي بنجاح وتوليد رقم البلاغ الرسمي",
      data: fallbackRequest,
    });
  }
};

/**
 * GET /api/requests/my
 * Get all requests submitted by the logged-in factory
 */
exports.getMyRequests = async (req, res) => {
  try {
    const user = req.user;
    const identifiers = [
      user?.taxId,
      user?._id?.toString(),
      user?.factoryName,
    ].filter(Boolean);

    const whereClause = {
      [Op.or]: [
        { factoryId: identifiers },
        { factoryName: user?.factoryName || "---" },
      ],
    };

    const requests = await ProblemRequest.findAll({
      where: whereClause,
      include: [
        {
          model: RequestFactoryLink,
          as: "linkedFactories",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.warn("SQL database offline, returning mock requests:", error.message);
    const mockData = mockStore.getRequestsByFactory(req.user?.taxId || req.user?._id);
    return res.status(200).json({
      success: true,
      count: mockData.length,
      data: mockData,
    });
  }
};

/**
 * GET /api/requests/:id
 * Get single request details
 */
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ProblemRequest.findOne({
      where: { requestId: id },
      include: [
        {
          model: RequestFactoryLink,
          as: "linkedFactories",
          required: false,
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "الطلب الصناعي غير موجود",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching request details:", error);
    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب بيانات الطلب.",
      error: error.message,
    });
  }
};

/**
 * GET /api/requests
 * Admin endpoint to list all industrial requests
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ProblemRequest.findAll({
      include: [
        {
          model: RequestFactoryLink,
          as: "linkedFactories",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.warn("SQL database offline, returning all mock requests:", error.message);
    const mockData = mockStore.getAllRequests();
    return res.status(200).json({
      success: true,
      count: mockData.length,
      data: mockData,
    });
  }
};

