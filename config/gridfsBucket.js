const mongoose = require("mongoose");
const { Readable } = require("stream");
exports.createGfsBucket = (conn, modelName) => {
  return new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: `${modelName}Uploads`,
  });
};

exports.deleteFile = (gfs, fileId) => {
  return new Promise(async (res, rej) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(fileId))
        throw Error("not valid ID");
      const deletedFile = await gfs.delete(
        mongoose.Types.ObjectId.createFromBase64(fileId)
      );
      res(true);
    } catch (err) {
      rej(err);
    }
  });
};

exports.uploadFile = (gfs, file) => {
  return new Promise((res, rej) => {
    // Log file details
    console.log("File received:", file.originalname, file.mimetype);
    console.log("File buffer length:", file.buffer.length);

    if (file.buffer.length === 0) {
      return rej({ message: "there is no content" });
    }
    // make a readable stream
    const fileStream = Readable.from(file.buffer);
    console.log("created filestream from file buffer");
    const uploadStream = gfs.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });
    console.log("Upload stream created:", uploadStream);

    //pipel the readable stream to uploadstream
    fileStream.pipe(uploadStream);

    console.log("piping buffer to uploadStream");
    // Event listener for 'finish' event
    uploadStream.on("finish", () => {
      console.log("File upload finished. Responding...");
      res(uploadStream);
    });

    // Handle errors during the upload process
    uploadStream.on("error", (err) => {
      console.error("Upload stream error:", err);
      rej(err);
    });
  });
};

const { ObjectId } = require("mongodb");
const { ObjectID } = require("mongodb");

exports.readFile = (gfs, fileId) => {
  return new Promise((res, rej) => {
    // Validate the fileId
    if (!ObjectId.isValid(fileId)) {
      return rej({ message: "Invalid file ID" });
    }

    // Derive the collection name from the bucket name
    const filesCollection = `${gfs.s.options.bucketName}.files`;

    console.log(`Using GridFS bucket: ${gfs.s.options.bucketName}`);

    // Create a download stream for the file
    const downloadStream = gfs.openDownloadStream(new ObjectId(fileId));
    const chunks = [];
    console.log("Download stream created for file:", fileId);

    // Collect data chunks
    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // Resolve with the combined buffer and metadata on 'end'
    downloadStream.on("end", async () => {
      console.log("Finished reading file. Preparing response...");
      const buffer = Buffer.concat(chunks);

      try {
        // Retrieve file metadata from the derived collection
        const fileMetadata = await gfs.s.db
          .collection(filesCollection)
          .findOne({ _id: new ObjectId(fileId) });

        if (!fileMetadata) {
          return rej({ message: "File metadata not found" });
        }

        console.log("File metadata fetched:", fileMetadata);
        res({ metadata: fileMetadata, buffer });
      } catch (err) {
        console.error("Error fetching file metadata:", err);
        rej(err);
      }
    });

    // Reject on stream error
    downloadStream.on("error", (err) => {
      console.error("Error during file read:", err);
      rej(err);
    });
  });
};
