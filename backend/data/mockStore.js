const bcrypt = require("bcryptjs");

// Pre-hashed passwords for instant login without DB
// Password: Admin123!
const ADMIN_HASH = bcrypt.hashSync("Admin123!", 10);
// Password: User123!
const USER_HASH = bcrypt.hashSync("User123!", 10);

const initialFactories = [
  {
    _id: "6ae0da6201ee1ce6e4a0bdb8",
    factoryName: "إدارة المنظومة الصناعية - IMC",
    taxId: "ADMIN-IMC-001",
    taxCardImage: {
      fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    },
    commercialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    },
    industrialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
    },
    contactInfo: {
      email: "admin@imc.gov.eg",
      phone: "01000000000",
    },
    password: ADMIN_HASH,
    role: "admin",
    accountStatus: "approved",
    location: {
      governorate: "القاهرة",
      city: "مدينة نصر",
      industrialZone: "المقر الرئيسي لمركز تحديث الصناعة",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6ad8ea55cc4efed03ae83197",
    factoryName: "شركة النيل للصناعات الهندسية",
    taxId: "TAX-10001",
    taxCardImage: {
      fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
    },
    commercialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
    },
    industrialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600",
    },
    contactInfo: {
      email: "user@factory.com",
      phone: "01012345678",
    },
    password: USER_HASH,
    role: "factory",
    accountStatus: "approved",
    location: {
      governorate: "القاهرة",
      city: "مدينة بدر",
      industrialZone: "المنطقة الصناعية - الروبيكي",
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6ad8ecd3cc4efed03ae83198",
    factoryName: "مصنع الأمل للغزل والنسيج",
    taxId: "TAX-20002",
    taxCardImage: {
      fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    },
    commercialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    },
    industrialRegImage: {
      fileUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    },
    contactInfo: {
      email: "pending@factory.com",
      phone: "01123456789",
    },
    password: USER_HASH,
    role: "factory",
    accountStatus: "pending",
    location: {
      governorate: "الغربية",
      city: "المحلة الكبرى",
      industrialZone: "المنطقة الصناعية الأولى",
    },
    createdAt: new Date().toISOString(),
  },
];

const initialRequests = [
  {
    id: 1,
    requestId: "REQ-2026-1001",
    factoryId: "TAX-10001",
    companyName: "شركة النيل للصناعات الهندسية",
    factoryName: "شركة النيل للصناعات الهندسية",
    requestType: "تحديات وأعطال فنية",
    requestDetails: "توقف متكرر في خط الدرفلة الهيدروليكي وارتفاع حرارة المحركات",
    governorate: "القاهرة",
    city: "مدينة بدر",
    status: "قيد الدراسة والتحليل",
    impactCategory: "انخفاض الطاقة الإنتاجية بنسبة 25%",
    createdAt: new Date().toISOString(),
  },
];

class MockStore {
  constructor() {
    this.factories = [...initialFactories];
    this.requests = [...initialRequests];
  }

  // Find factory by email
  findFactoryByEmail(email) {
    const cleanEmail = String(email || "").toLowerCase().trim();
    return this.factories.find(
      (f) => f.contactInfo?.email?.toLowerCase().trim() === cleanEmail
    );
  }

  // Find factory by ID
  findFactoryById(id) {
    const idStr = String(id);
    return this.factories.find((f) => String(f._id) === idStr);
  }

  // Create new factory
  createFactory(data) {
    const newFactory = {
      _id: "mock_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      factoryName: data.factoryName || "منشأة صناعية",
      taxId: data.taxId || "TAX-" + Math.floor(10000 + Math.random() * 90000),
      taxCardImage: data.taxCardImage || { fileUrl: "" },
      commercialRegImage: data.commercialRegImage || { fileUrl: "" },
      industrialRegImage: data.industrialRegImage || { fileUrl: "" },
      location: data.location || { governorate: "", city: "", industrialZone: "" },
      contactInfo: {
        email: data.contactInfo?.email || data.email,
        phone: data.contactInfo?.phone || data.phone || "",
      },
      password: data.password,
      role: data.role || "factory",
      accountStatus: data.accountStatus || "pending",
      auditNotes: "",
      rejectionReason: "",
      createdAt: new Date().toISOString(),
    };

    this.factories.unshift(newFactory);
    return newFactory;
  }

  // Get factories with filters for Admin
  getFactories(status = "", search = "") {
    let list = this.factories.filter((f) => f.role === "factory");

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      list = list.filter((f) => f.accountStatus === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.factoryName?.toLowerCase().includes(q) ||
          f.contactInfo?.email?.toLowerCase().includes(q) ||
          f.contactInfo?.phone?.includes(q) ||
          f.taxId?.toLowerCase().includes(q) ||
          f.location?.city?.toLowerCase().includes(q) ||
          f.location?.governorate?.toLowerCase().includes(q)
      );
    }

    return list.map((f) => {
      const copy = { ...f };
      delete copy.password;
      return copy;
    });
  }

  // Get factory statistics for Admin
  getStats() {
    const factoryList = this.factories.filter((f) => f.role === "factory");
    return {
      total: factoryList.length,
      pending: factoryList.filter((f) => f.accountStatus === "pending").length,
      approved: factoryList.filter((f) => f.accountStatus === "approved").length,
      rejected: factoryList.filter((f) => f.accountStatus === "rejected").length,
    };
  }

  // Update factory accountStatus (approve / reject)
  updateFactoryStatus(id, newStatus, auditNotes = "", rejectionReason = "") {
    const factory = this.findFactoryById(id);
    if (!factory) return null;

    factory.accountStatus = newStatus;
    if (auditNotes) factory.auditNotes = auditNotes;
    if (rejectionReason) factory.rejectionReason = rejectionReason;
    if (newStatus === "approved") {
      factory.approvedAt = new Date().toISOString();
    }

    const copy = { ...factory };
    delete copy.password;
    return copy;
  }

  // Submit new request
  createRequest(data) {
    const newReq = {
      id: this.requests.length + 1,
      requestId:
        data.requestId ||
        `REQ-${new Date().getFullYear()}-${String(1000 + this.requests.length + 1)}`,
      factoryId: data.factoryId || "FAC-1001",
      companyName: data.companyName || data.factoryName || "المنشأة الصناعية",
      factoryName: data.factoryName || data.companyName || "المنشأة الصناعية",
      requestType: data.requestType || "تحديات فنية",
      requestDetails: data.requestDetails || "",
      governorate: data.governorate || "القاهرة",
      city: data.city || "مدينة بدر",
      status: "قيد الدراسة والتحليل",
      impactCategory: data.impactCategory || "",
      createdAt: new Date().toISOString(),
      ...data,
    };

    this.requests.unshift(newReq);
    return newReq;
  }

  // Get requests for factory
  getRequestsByFactory(factoryId) {
    if (!factoryId) return this.requests;
    const fid = String(factoryId);
    return this.requests.filter(
      (r) => String(r.factoryId) === fid || String(r.taxId) === fid
    );
  }

  // Get all requests
  getAllRequests() {
    return this.requests;
  }
}

// Singleton instance
const mockStore = new MockStore();

module.exports = mockStore;
