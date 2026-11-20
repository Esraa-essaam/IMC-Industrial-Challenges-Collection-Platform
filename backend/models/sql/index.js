const { sequelize, connectSQL } = require("../../Config/sqlDb");

// Only define models & associations when sequelize is available (remote DB configured)
let ProblemRequest = null;
let RequestFactoryLink = null;

if (sequelize) {
  ProblemRequest = require("./ProblemRequest");
  RequestFactoryLink = require("./RequestFactoryLink");

  // Associations
  ProblemRequest.hasMany(RequestFactoryLink, {
    foreignKey: "requestId",
    as: "factoryLinks",
    onDelete: "CASCADE",
  });
  RequestFactoryLink.belongsTo(ProblemRequest, {
    foreignKey: "requestId",
    as: "request",
  });
}

const initSqlDb = async () => {
  if (!sequelize) {
    console.info("ℹ️ PostgreSQL skipped — no remote URI configured (mock mode active).");
    return;
  }
  try {
    const connected = await connectSQL();
    if (connected) {
      await sequelize.sync({ alter: true });
      console.log("✅ PostgreSQL Relational Schema synchronized successfully (ProblemRequests, RequestFactoryLinks)");
    }
  } catch (error) {
    console.warn("⚠️ PostgreSQL Schema synchronization notice:", error.message);
  }
};

module.exports = {
  sequelize,
  connectSQL,
  initSqlDb,
  ProblemRequest,
  RequestFactoryLink,
};
