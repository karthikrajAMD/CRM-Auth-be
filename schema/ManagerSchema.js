const mongoose = require("mongoose");
const validator = require("validator");

const ManagerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      required: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    role: { type: String, default: "Manager" },
    createdAt: { type: String, default: new Date() },
  },
  { collection: "crmManager", versionKey: false }
);
const managerModel = mongoose.model("crmManager", ManagerSchema);
module.exports = { managerModel };
