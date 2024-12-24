const express = require("express");
const memberControl = require("../controls/memberControl");
const router = express.Router();

router.get("/", memberControl.getAll);
router.get("/:id", memberControl.getById);
router.post("/", memberControl.create);
router.put("/:id", memberControl.update);
router.delete("/:id");

module.exports = router;
