const express = require("express");
const projectControls = require("../controls/projectControl");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", projectControls.getAll);
router.post("/", upload.single("projectImage"), projectControls.create);
router.get("/:id", projectControls.getById);
router.put("/:id", upload.single("projectImage"), projectControls.update);
router.get("/:userId/photo/:photoId", projectControls.getPhoto);
module.exports = router;
