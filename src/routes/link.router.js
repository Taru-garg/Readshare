"use strict";

const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../controllers/auth/utils");
const link = require("../controllers/link/link.controller");

router.post("/team/add/links", isAuthenticated, link.add);
router.delete("/team/remove/links", isAuthenticated, link.remove);

module.exports = router;
