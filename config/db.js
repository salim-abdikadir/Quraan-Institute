const mongoose = require("mongoose");
require("dotenv").config();

const mongodbUri = process.env.MONGODB_URI;

let gfs; // GridFS instance
let isConnected = false; // Flag to track connection state

function createGfsBucket(conn, modelName) {
  return new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: `${modelName}Uploads`,
  });
}

async function connect() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(mongodbUri);

    // Initialize GridFS once the database connection is ready
    gfs = {
      projectGFS: createGfsBucket(conn, "project"),
      partnerGFS: createGfsBucket(conn, "partner"),
      photoGFS: createGfsBucket(conn, "photo"),
      memberGFS: createGfsBucket(conn, "member"),
    };
    // Setup Multer-GridFS storage

    isConnected = true; // Mark as connected
    console.log("Connected to MongoDB and GridFS initialized.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
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
