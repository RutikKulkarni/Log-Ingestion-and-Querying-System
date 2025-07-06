const express = require("express");
const logController = require("../controllers/logController");
const { validateLog } = require("../middleware/validation");

const router = express.Router();

router.post("/", validateLog, logController.createLog);
router.get("/", logController.getLogs);

module.exports = router;
