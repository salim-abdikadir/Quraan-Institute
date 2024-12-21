const express = require("express");
const fileController = require("../controls/fileControl");

const router = express.Router();

// Upload file route
router.post("/upload", fileController.uploadFile, (req, res) => {
  res.json({ file: req.file });
});

// Get file route
router.get("/:filename", fileController.getFile);

// Delete file route
router.delete("/:id", fileController.deleteFile);

module.exports = router;
