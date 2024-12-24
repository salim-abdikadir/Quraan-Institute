const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
require("dotenv").config();

const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb"; // MongoDB URI

// Initialize Express
const app = express();

// Set up Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection and GridFS setup
// async function connectToMongoDB() {
//   try {
//     // Connect to MongoDB
//     const conn = await mongoose.connect(mongodbUri);

//     const db = conn.connection.db;
//     const gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

//     console.log("Connected to MongoDB and GridFS initialized.");
//     return gfs;
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     throw err;
//   }
// }

// Upload route for file uploads using Multer
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Initialize the GridFSBucket instance

    

    // Create the upload stream for GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    console.log("Upload stream created:", uploadStream);

    // Create a Readable stream from the uploaded file buffer
    const readableStream = Readable.from(req.file.buffer);

    // Pipe the file buffer directly to GridFS
    readableStream.pipe(uploadStream);
    console.log("Piping file buffer to upload stream.");

    // Listen for events on the upload stream
    uploadStream.on("finish", () => {
      console.log("File upload finished.");
      res.status(200).send({ fileId: uploadStream.id });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload stream error:", err);
      res.status(500).send({ error: err.message });
    });

    uploadStream.on("close", () => {
      console.log("Upload stream closed.");
    });

    uploadStream.on("data", (chunk) => {
      console.log(`Uploaded chunk of size: ${chunk.length}`);
    });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).send({ error: err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
