const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  publicationDate: {
    type: mongoose.Schema.Types.Date,
    default: () => Date.now(),
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
  featuredImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "newsUploads",
    default: null,
  },
});

function checkForUser(next) {
  const updateData = this.getUpdate();
  if (!updateData?.updatedBy) throw Error("updatedBy must be set to userId");
  next();
}

function populatingProject(next) {
  this.populate({ path: "createdBy", select: "username role" })
    .populate({ path: "updatedBy", select: "username role" })
    .populate("featuredImage");

  next();
}

newsSchema.pre("findOne", populatingProject);
newsSchema.pre("find", populatingProject);
newsSchema.pre("updateMany", checkForUser);
newsSchema.pre("updateOne", checkForUser);
newsSchema.pre("findOneAndUpdate", checkForUser);

module.exports = mongoose.model("News", newsSchema);
