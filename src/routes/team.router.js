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
  "/team/create",
  isAuthenticated,
  createValidationFor("createTeam"),
  checkValidationResult,
  team.createTeam
);

router.delete("/team/delete", isAuthenticated, team.deleteTeam);

router.post(
  "/team/add/member",
  isAuthenticated,
  createValidationFor("addmember"),
  checkValidationResult,
  team.addmember
);

router.delete("/team/delete/member", isAuthenticated, team.removemember);

router.get("/teams", isAuthenticated, team.getTeams);

module.exports = router;
