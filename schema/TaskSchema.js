const mongoose = require("mongoose");
const validator = require("validator");

const TaskSchema = new mongoose.Schema(
  {
    assignedDate: { type: String, required: true },
    taskName: { type: String, required: true },
    assignedBy: { type: String, required: true },
    assignedTo: {
      type: String,
      lowercase: true,
      required: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    deadLine: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, default: new Date() },
  },
  { collection: "Tasks", versionKey: false }
);
const TaskModel = mongoose.model("Tasks", TaskSchema);
module.exports = { TaskModel };
