const express = require("express");
const projectControls = require("../controls/projectControl")
const createHttpError = require("http-errors");
const router = express.Router();

router.get("/", projectControls.getAll);
router.post("/", projectControls.create);
router.get("/:id", projectControls.getById);
router.put("/:id", projectControls.update);
module.exports = router;
