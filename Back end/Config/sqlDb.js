require("dotenv").config();
const { Sequelize } = require("sequelize");

/**
 * PostgreSQL Database Connection (Exclusively for Phase 2 Relational Engine)
 */
const isSsl = process.env.DB_SSL === "true" || process.env.DATABASE_SSL === "true";
const sslOptions = isSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {};

const postgresUri =
  process.env.POSTGRES_URI ||
  process.env.DATABASE_URL ||
  `postgresql://${encodeURIComponent(process.env.DB_USER || "postgres")}:${encodeURIComponent(
    process.env.DB_PASSWORD || "postgres"
  )}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "imc_database"
  }`;

const sequelize = new Sequelize(postgresUri, {
  dialect: "postgres",
  logging: false, // Clean console output
  dialectOptions: sslOptions,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Database connected successfully (Postgres Engine Active)");
    return true;
  } catch (error) {
    console.warn(`⚠️ PostgreSQL Connection Notice: ${error.message}`);
    console.info("ℹ️ تأكد من تشغيل خادم PostgreSQL محلياً أو ضبط بيانات POSTGRES_URI في ملف .env.");
    return false;
  }
};

module.exports = {
  sequelize,
  connectSQL,
};
