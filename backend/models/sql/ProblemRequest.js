const { DataTypes } = require("sequelize");
const { sequelize } = require("../../Config/sqlDb");

const ProblemRequest = sequelize.define(
  "ProblemRequest",
  {
    requestId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    factoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affectedFactoryIds: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    affectedFactoryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    factoryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industrialSector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    governorate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    factorySize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imcClient: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "لا",
    },
    requestType: {
      type: DataTypes.STRING,
      allowNull: false, // challenge | improve | idea | localize | lab
    },
    reportedAreaCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportedAreaLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportedSymptomCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportedSymptomLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    symptomDetail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    freeDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    opportunityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opportunityTypeLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labKnowledge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestAreaCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestAreaLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labTestName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labGoalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labGoalLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labSubjectMode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labMaterialFamily: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labMaterialType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labProductFamily: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labProductType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labOtherSubject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labStandard: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labUsage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labUsageLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    labSampleCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequencyLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affectedScope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affectedScopeLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    impactCodes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    impactLabels: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    expectedBenefitCodes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    expectedBenefitLabels: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    desiredOutcome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desiredOutcomeLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricContext: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricTypeLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricValue: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    metricUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metricPeriod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imcProgram: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    imcVerifiedDiscipline: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    imcResearchSuitability: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    imcReviewStatus: {
      type: DataTypes.STRING,
      defaultValue: "AwaitingReview",
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dataType: {
      type: DataTypes.STRING,
      defaultValue: "DEMO",
    },
    consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ProblemRequests",
    timestamps: true,
  }
);

module.exports = ProblemRequest;

