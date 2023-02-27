const mongoose = require("mongoose");
const validator = require("validator");

const AdminSchema = new mongoose.Schema(
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
    profile: {
      type: String,
      required: true,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role: { type: String, default: "admin" },
    createdAt: { type: String, default: new Date() },
  },
  { collection: "crmAdmin", versionKey: false }
);
const adminModel = mongoose.model("crmAdmin", AdminSchema);
module.exports = { adminModel };
