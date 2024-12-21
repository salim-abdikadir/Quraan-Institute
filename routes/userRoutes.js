const express = require("express");
const userControl = require("../controls/userControls");
const { authHandling, roleHandling } = require("../handlers/authHandler");
const router = express.Router();

router.get("/", userControl.getAll);
router.get("/:id", userControl.getById);
router.post("/", userControl.create);
router.put("/:id", userControl.update);
router.delete("/:id");

module.exports = router;
