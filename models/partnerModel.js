const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9\-\+\s()]*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: {
    type: String,
    required: true,
  },
  partnershipType: {
    type: String,
    required: true,
    enum: ["Sponsorship", "Collaboration", "Other"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: null,
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
});

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
PartnerSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.photo) {
      ret.photo = `${
        process.env.BASE_URL || "http://localhost:8000"
      }/api/projects/${ret._id}/photo/${ret.photo}`;
    }
    return ret;
  },
});

PartnerSchema.pre("findOne", populatingProject);
PartnerSchema.pre("find", populatingProject);
PartnerSchema.pre("updateMany", checkForUser);
PartnerSchema.pre("updateOne", checkForUser);
PartnerSchema.pre("findOneAndUpdate", checkForUser);

module.exports = mongoose.model("Partner", PartnerSchema);
