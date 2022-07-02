"use strict";

const express = require("express");
const router = express.Router();
const team = require("../controllers/team/team.controller");
const { isAuthenticated } = require("../controllers/auth/utils");
const {
  createValidationFor,
  checkValidationResult,
} = require("../controllers/validators/validator");

router.post(
  "/createTeam",
  isAuthenticated,
  createValidationFor("createTeam"),
  checkValidationResult,
  team.createTeam
);

router.delete("/deleteTeam", isAuthenticated, team.deleteTeam);

router.post(
  "/addmember",
  isAuthenticated,
  createValidationFor("addmember"),
  checkValidationResult,
  team.addmember
);
router.delete("/removemember", isAuthenticated, team.removemember);

router.get(
  "/getTeams",
  isAuthenticated,
  createValidationFor("getTeams"),
  checkValidationResult,
  team.getTeams
);

module.exports = router;
