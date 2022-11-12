const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
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
    role: { type: String, default: "user" },
    createdAt: { type: String, default: new Date() },
  },
  { collection: "users", versionKey: false }
);
const userModel = mongoose.model("users", userSchema);
module.exports = { userModel };
