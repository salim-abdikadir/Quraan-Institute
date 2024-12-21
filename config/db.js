require("dotenv").config();
const { Grid } = require("gridfs-stream");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

const mongodbUri = process.env.MONGODB_URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose.set("toJSON", { getters: true });
mongoose.set("toObject", { getters: true });
let gfs; // GridFS instance

async function connect() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(mongodbUri, clientOptions);

    // Initialize GridFS once the database connection is ready
    const db = mongoose.connection.db;
    gfs = new GridFSBucket(db, {bucketName:"projectUploads"})

    console.log("Connected to MongoDB and GridFS initialized.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error(err);
  }
}

function getGFS() {
  if (!gfs) {
    throw new Error(
      "GridFS is not initialized. Connect to the database first."
    );
  }
  return gfs;
}
module.exports = { connect, getGFS };
