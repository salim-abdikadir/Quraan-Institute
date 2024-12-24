const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      required: true,
      min: [7, "the minimum is 7 characters"],
      max: [14, "the maximum is 10 characters"],
      validate: {
        validator: function (v) {
          return /^[0-9\-\+\s()]*$/.test(v); // Basic validation for phone numbers
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    address: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      required: true,
      enum: ["active", "inactive"],
    },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: null,
      default: null,
    },
    joiningDate: {
      type: mongoose.Schema.Types.Date,
      deafult: (() => Date.now())(),
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

function checkForUser(next) {
  const updateData = this.getUpdate();
  if (!updateData?.updatedBy) throw Error("updatedBy must be set to userId");
  next();
}

function populatingProject(next) {
  this.populate({ path: "createdBy", select: "username role" })
    .populate({ path: "updatedBy", select: "username role" })
    .populate("department");
  next();
}
memberSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.photo) {
      ret.photo = `${
        process.env.BASE_URL || "http://localhost:8000"
      }/api/members/${ret._id}/photo/${ret.photo}`;
    }
    return ret;
  },
});

memberSchema.pre("findOne", populatingProject);
memberSchema.pre("find", populatingProject);
memberSchema.pre("updateMany", checkForUser);
memberSchema.pre("updateOne", checkForUser);
memberSchema.pre("findOneAndUpdate", checkForUser);

module.exports = mongoose.model("Member", memberSchema);
