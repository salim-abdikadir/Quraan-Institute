const express = require("express");
const departmentControl = require("../controls/departmentControls");
const router = express.Router();

router.get("/", departmentControl.getAll);
router.get("/:id", departmentControl.getById);
router.post("/", departmentControl.create);
router.put("/:id", departmentControl.update);
router.delete("/:id");

module.exports = router;
