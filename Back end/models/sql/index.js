const { sequelize, connectSQL } = require("../../Config/sqlDb");
const ProblemRequest = require("./ProblemRequest");
const RequestFactoryLink = require("./RequestFactoryLink");

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

const initSqlDb = async () => {
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
