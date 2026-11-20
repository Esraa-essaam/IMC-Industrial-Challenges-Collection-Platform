const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

/**
 * PostgreSQL Database Connection (Exclusively for Phase 2 Relational Engine)
 * On Vercel serverless: skip entirely unless a real POSTGRES_URI is provided
 */
const isSsl = process.env.DB_SSL === "true" || process.env.DATABASE_SSL === "true";
const sslOptions = isSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

// Detect if we have a real remote DB or only localhost fallback
const postgresUri =
  process.env.POSTGRES_URI ||
  process.env.DATABASE_URL ||
  null; // Do NOT fall back to localhost — avoids hanging on Vercel

const isLocalhostUri = !postgresUri ||
  postgresUri.includes("127.0.0.1") ||
  postgresUri.includes("localhost");

// Only create Sequelize instance when we have a real remote URI
const sequelize = isLocalhostUri
  ? null
  : new Sequelize(postgresUri, {
      dialect: "postgres",
      logging: false,
      dialectOptions: sslOptions,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    });

const connectSQL = async () => {
  // Skip entirely if no real remote URI available
  if (isLocalhostUri) {
    console.info("ℹ️ No remote POSTGRES_URI set — skipping PostgreSQL connection (mock mode active).");
    return false;
  }

  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database connected successfully (Postgres Engine Active)");
    return true;
  } catch (error) {
    console.warn(`⚠️ PostgreSQL Connection Notice: ${error.message}`);
    return false;
  }
};

module.exports = {
  sequelize,
  connectSQL,
};
