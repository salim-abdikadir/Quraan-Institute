const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      max: [30, "the title must be less than 30"],
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    startDate: {
      type: mongoose.Schema.Types.Date,
      default: (() => Date.now())(),
    },
    endDate: {
      type: mongoose.Schema.Types.Date,
      default: null,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ["planned", "ongoing", "completed"],
      required: true,
    },
    photo: {
      type: mongoose.Schema.Types.String,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
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

function populatingProject(next) {
  this.populate("createdBy").populate("updatedBy").populate("department");

  next();
}

projectSchema.pre("findOne", populatingProject);
projectSchema.pre("find", populatingProject);
projectSchema.pre("updateMany", checkForUser);
projectSchema.pre("updateOne", checkForUser);
projectSchema.pre("findOneAndUpdate", checkForUser);

module.exports = mongoose.model("Project", projectSchema);
