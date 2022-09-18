"use strict";

const express = require("express");
const Invite = require("../../models/Invite");
const User = require("../../models/User");
const { isAuthenticated } = require("../controllers/auth/utils");
const {
  createValidationFor,
  checkValidationResult,
} = require("../controllers/validators/validator");
const { accept } = require("../controllers/invite/accept.action");

const router = express.Router();

router.get(
  "/invite/verify/:id",
  isAuthenticated,
  createValidationFor("acceptInvite"),
  checkValidationResult,
  accept,
);

module.exports = router;
