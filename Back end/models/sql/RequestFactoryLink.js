const { DataTypes } = require("sequelize");
const { sequelize } = require("../../Config/sqlDb");

const RequestFactoryLink = sequelize.define(
  "RequestFactoryLink",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requestId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    factoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    factoryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "RequestFactoryLinks",
    timestamps: true,
  }
);

module.exports = RequestFactoryLink;

