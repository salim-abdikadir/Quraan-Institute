"use strict";
const express = require("express");
const multer = require("multer");
const { getGFS } = require("../config/db");
const { Readable } = require("stream");
const { uploadFile, readFile } = require("../config/gridfsBucket");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const { memberGFS, projectGFS, partnetGFS, photoGFS } = getGFS();
router.post("/upload", upload.single("file"), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    file.buffer = "";
    const uploadedFile = await uploadFile(memberGFS, file);
    res.status(200).json(uploadedFile.id);
  } catch (err) {
    res.json(err);
  }
});

router.get("/member/image/:fileId", async (req, res) => {
  try {
    const { metadata, buffer } = await readFile(memberGFS, req.params.fileId);
    res.set("Content-Type", metadata.contentType || "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/partner/image/:fileId", async (req, res) => {
  try {
    const { metadata, buffer } = await readFile(partnetGFS, req.params.fileId);
    res.set("Content-Type", metadata.contentType || "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/project/image/:fileId", async (req, res) => {
  try {
    const { metadata, buffer } = await readFile(projectGFS, req.params.fileId);
    res.set("Content-Type", metadata.contentType || "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/media/image/:fileId", async (req, res) => {
  try {
    const { metadata, buffer } = await readFile(photoGFS, req.params.fileId);
    res.set("Content-Type", metadata.contentType || "application/octet-stream");
    res.send(buffer);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
