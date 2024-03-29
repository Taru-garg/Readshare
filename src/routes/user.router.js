"use strict";

const express = require("express");
const passport = require("passport");
const router = express.Router();
const user = require("../controllers/user/user.controller");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../controllers/auth/utils.js");
const {
  createValidationFor,
  checkValidationResult,
} = require("../controllers/validators/validator");

router.post(
  "/user/register",
  isNotAuthenticated,
  createValidationFor("register"),
  checkValidationResult,
  user.register
);

router.post(
  "/user/login",
  isNotAuthenticated,
  createValidationFor("login"),
  checkValidationResult,
  passport.authenticate("local", {
    successRedirect: "/",
    failureMessage: true,
  })
);

router.delete("/user/logout", isAuthenticated, user.logout);

module.exports = router;
