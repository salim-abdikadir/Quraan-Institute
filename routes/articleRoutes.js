const express = require("express");
const articleControls = require("../controls/articleControl");
const router = express.Router();

router.get("/", articleControls.getAll);
router.post("/", articleControls.create);
router.get("/:id", articleControls.getById);
router.put("/:id", articleControls.update);
module.exports = router;
