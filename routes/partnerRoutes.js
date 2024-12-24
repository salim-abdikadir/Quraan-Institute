const express = require("express");
const partnerControls = require("../controls/partnerControl");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", partnerControls.getAll);
router.post("/", upload.single("partnerImage"), partnerControls.create);
router.get("/:id", partnerControls.getById);
router.put("/:id", upload.single("partnerImage"), partnerControls.update);
router.get("/:userId/photo/:photoId", partnerControls.getPhoto);
module.exports = router;
