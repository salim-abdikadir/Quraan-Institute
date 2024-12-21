const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
      max: [10, "the characters must be at least 10"],
    },
    description: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

function checkForUser(next) {
  const updateData = this.getUpdate();
  if (!updateData?.updatedBy) throw Error("updatedBy must be set to userId");
  next();
}

departmentSchema.pre("updateMany", checkForUser);
departmentSchema.pre("updateOne", checkForUser);
departmentSchema.pre("findOneAndUpdate", checkForUser);

module.exports = mongoose.model("Department", departmentSchema);
