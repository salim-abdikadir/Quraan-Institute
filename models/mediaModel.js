const mongoose = require("mongoose");

// Sub-schema for Photos with GridFS Reference
const PhotoSchema = new mongoose.Schema({
  PhotoID: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
    immutable: true,
  },
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    trim: true,
  },
  File: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "mediaUploads",
  },
  UploadDate: {
    type: Date,
    default: Date.now,
  },
  CreateUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Sub-schema for Videos
const VideoSchema = new mongoose.Schema({
  VideoID: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
    immutable: true,
  },
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    trim: true,
  },
  URL: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  UploadDate: {
    type: Date,
    default: Date.now,
  },
  CreateUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Main Media Schema
const MediaSchema = new mongoose.Schema({
  Photos: [PhotoSchema], 
  Videos: [VideoSchema], 
});

module.exports = mongoose.model("Media", MediaSchema);
