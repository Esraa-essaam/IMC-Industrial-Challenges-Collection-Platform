const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const dbConnection = require("./Config/dbConnection");
const { initSqlDb } = require("./models/sql");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const requestRoutes = require("./Routes/requestRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/ErrorHandler");

const app = express();

// 1. Security: Hide backend technology fingerprint
app.disable("x-powered-by");

// 2. Security: Set robust HTTP security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 3. Security: Strict & Dynamic CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, postman, curl) or matched origins or any vercel.app preview
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS validation failed: Origin not authorized."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4. Payload limit: Allow up to 25MB for document uploads (Base64 tax cards, registrations)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// 5. Connect to MongoDB & SQL Database
dbConnection();
initSqlDb();

// Base / Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "منصة تحديات الصناعة | Industrial Challenges API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/requests", requestRoutes);

// 404 & Centralized Error Handler Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server (Only when not in Vercel Serverless environment or test)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running securely on port ${PORT}`);
  });
}

module.exports = app;
