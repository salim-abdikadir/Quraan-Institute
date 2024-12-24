const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.String,
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
    content: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    featuredImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articleUploads",
      required: true,
    },
    publicationDate: {
      type: mongoose.Schema.Types.Date,
      default: (() => Date.now())(),
    },
  },
  { timestamps: true }
);

function populatingProject(next) {
  this.populate({ path: "createdBy", select: "username role" })
    .populate({ path: "updatedBy", select: "username role" })
    .populate("featuredImage");

  next();
}

projectSchema.pre("findOne", populatingProject);
projectSchema.pre("find", populatingProject);

module.exports = mongoose.model("Article", articleSchema);
