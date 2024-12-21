const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { getGFS } = require("../config/db");

require("dotenv").config();

// Setup Multer-GridFS storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`, // Generate unique filename
      bucketName: "projectUploads", // Match the GridFS collection name
    };
  },
});

const upload = multer({ storage });

// Upload a single file
exports.uploadFile = upload.single("projectImage");

// Serve files from GridFS
exports.getFile = async (req, res) => {
  const gfs = getGFS();
  const { filename } = req.params;
  try {
    const file = await gfs.find({ filename }).toArray();
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    console.log(file);
    // Stream the file to the client
     gfs.openDownloadStreamByName(file.filename).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete file from GridFS
exports.deleteFile = async (req, res) => {
  const gfs = getGFS();
  const { id } = req.params;

  try {
    await gfs.remove({ _id: id, root: "uploads" });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
