"use strict";

const express = require("express");
const Invite = require("../../models/Invite");
const User = require("../../models/User");
const { isAuthenticated } = require("../controllers/auth/utils");
const {
  createValidationFor,
  checkValidationResult,
} = require("../controllers/validators/validator");
const { invite } = require("../controllers/invite/accept.action");

const router = express.Router();

router.get(
  "/invite/:id",
  isAuthenticated,
  createValidationFor("acceptInvite"),
  checkValidationResult,
  invite
);

module.exports = router;
