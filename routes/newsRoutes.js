const express = require("express");
const newsControls = require("../controls/newsControl");
const router = express.Router();

router.get("/", newsControls.getAll);
router.post("/", newsControls.create);
router.get("/:id", newsControls.getById);
router.put("/:id", newsControls.update);
module.exports = router;
