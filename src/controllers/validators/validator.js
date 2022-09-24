"use strict";

const { validationResult } = require("express-validator");
const {
  userValidatorLogin,
  userValidatorRegister,
} = require("./validator-user");
const {
  teamValidator,
  addmemberValidator,
  removeMemberValidator,
} = require("./validator-team");
const { inviteValidator } = require("./validator-invite");

function createValidationFor(route) {
  switch (route) {
    case "login":
      return userValidatorLogin();

    case "register":
      return userValidatorRegister();

    case "createTeam":
      return teamValidator();

    case "addmember":
      return addmemberValidator();

    case "getTeams":
      return getTeamValidator();

    case "acceptInvite":
      return inviteValidator();

    case "removemember":
      return removeMemberValidator();
    
    default:
      return [];
  }
}

function checkValidationResult(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  res.status(422).json({ errors: result.array({ onlyFirstError: true }) });
}

module.exports = {
  createValidationFor: createValidationFor,
  checkValidationResult: checkValidationResult,
};
