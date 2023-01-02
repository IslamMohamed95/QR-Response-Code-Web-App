const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    unitArea: {
      type: String,
    },
    ownerName: {
      type: String,
      trim: true,
      required: true,
    },
    ownerNumber: {
      type: Number,
      trim: true,
      required: true,
    },
    Id: {
      type: Number,
      unique: true,
      required: true,
    },
    site: {
      type: String,
      enum: [
        "مركز مزيد",
        "مركز الهير",
        "مركز وسط المدينة",
        "مركز المقام",
        "مركز الوقن",
      ],
      required: true,
    },
    type: {
      type: String,
      trim: true,
      required: true,
    },
    areaName: {
      type: String,
      required: true,
    },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
      address: { type: String },
    },
    awarenessTimes: {
      type: Number,
      default: 0,
    },
    warning: {
      warningName: { type: String, trim: true },
      warningDate: { type: Date },
      warningNote: { type: String, default: "" },
    },
    warningsNumber: { type: Number, default: 0 },
    warnings: [],
    penalty: {
      penaltyName: { type: String, trim: true },
      penaltyDate: { type: Date },
      penaltyNote: { type: String, default: "" },
    },
    penaltiesNumber: { type: Number, default: 0 },
    penalties: [],
    scanning: {
      scanningTimes: { type: Number, default: 0 },
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    contractStartDate: {
      type: Date,
    },
    contractEndDate: {
      type: Date,
    },
    pin: {
      type: String,
      default: "",
    },
    contractCondition: {
      type: String,
      enum: ["ساري المفعول", "العقد منتهي", "لا يوجد عقد إيجار"],
    },
    history: [
      {
        adminName: {
          type: String,
          required: true,
        },
        role: {
          type: "String",
          required: true,
        },
        action: [
          {
            type: {
              type: String,
              required: true,
              enum: ["اضافة", "تعديل", "حذف"],
            },
            date: {
              type: Date,
              required: true,
            },
            difference: [],
            differenceLength: "",
            maxLength: "",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
