const express = require("express");
const memberControl = require("../controls/memberControl");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", memberControl.getAll);
router.post("/", upload.single("memberImage"), memberControl.create);
router.get("/:id", memberControl.getById);
router.put("/:id", upload.single("memberImage"), memberControl.update);
router.get("/:userId/photo/:photoId", memberControl.getPhoto);

module.exports = router;
