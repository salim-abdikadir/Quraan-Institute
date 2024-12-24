const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.String,
      unique: [true, "the username must be unique"],
      required: [true, "username is required"],
      max: [30, "the maximum is 30 characters"],
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: [true, "the email field is required"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: [true, "the password is required"],
      max: [30, "the maximum is 30 characters"],
    },
    role: {
      type: mongoose.Schema.Types.String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastLogin: {
      type: mongoose.Schema.Types.Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.statics.comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
module.exports = mongoose.model("User", userSchema);
