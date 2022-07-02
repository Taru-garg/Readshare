"use strict";

const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../controllers/auth/utils");
const link = require("../controllers/link/link.controller");

router.post("/addLink", isAuthenticated, link.add);
router.delete("/removeLink", isAuthenticated, link.remove);

module.exports = router;
