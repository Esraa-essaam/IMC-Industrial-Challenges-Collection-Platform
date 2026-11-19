
const mongoose = require("mongoose");

const factorySchema = new mongoose.Schema(
    {
        factoryName: {
            type: String,
            required: [true, "Factory name is required"],
            trim: true,
        },

        taxId: {
            type: String,
            trim: true,
        },

        taxCardImage: {
            fileUrl: {
                type: String,
                required: true,
            },
        },

        commercialRegImage: {
            fileUrl: {
                type: String,
                required: true,
            },
        },

        industrialRegImage: {
            fileUrl: {
                type: String,
                required: true,
            },
        },

        industrialActivityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IndustrialActivity",
        },

        location: {
            governorate: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            industrialZone: {
                type: String,
                trim: true,
            },
        },

        contactInfo: {
            phone: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
                unique: true,
                sparse: true,
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },

        role: {
            type: String,
            enum: ["factory", "admin"],
            default: "factory",
        },

        accountStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        auditNotes: {
            type: String,
            trim: true,
        },

        rejectionReason: {
            type: String,
            trim: true,
        },

        approvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Factory", factorySchema);
