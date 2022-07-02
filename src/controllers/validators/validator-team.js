"use strict";

const { check } = require("express-validator");

const teamValidator = () => {
  return [
    check("name", "Please provide a valid Team Name.").exists().isString(),
    check("members")
      .if(check("members").exists())
      .isArray()
      .customSanitizer((value) => {
        return Array.from(new Set(value));
      }),
    check("members.*").if(check("members").exists()).isEmail(),
    check("links", "Not a valid array")
      .if(check("link").exists())
      .isArray()
      .customSanitizer((value) => {
        return Array.from(new Set(value));
      }),
    check("links.*.url", "Please provide valid links")
      .exists()
      .isURL()
      .not()
      .isEmpty(),
    check("links.*.tags").if(check("links.*.tags").exists()).isArray(),
    check("links.*.tags.*").if(check("links.*.tags.*").exists()).isString(),
  ];
};

const addmemberValidator = () => {
  return [
    check("emails", "Please provide a valid Member List")
      .exists()
      .isArray()
      .customSanitizer((value) => {
        return Array.from(new Set(value));
      }),
    check("email.*", "Please provide valid emails").exists().isEmail(),
    check("teamId", "Please provide a valid Team Id").exists().isMongoId(),
  ];
};

const getTeamValidator = () => {
  return [];
};

module.exports = {
  teamValidator: teamValidator,
  addmemberValidator: addmemberValidator,
  getTeamValidator: getTeamValidator,
};
