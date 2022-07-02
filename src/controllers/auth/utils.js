"use strict";

const { check } = require("express-validator");

const isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res
    .status(401)
    .json({ errors: [{ msg: "Authentication Required." }] });
};

const isNotAuthenticated = async (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  return res.status(401).json({ errors: [{ msg: "Already Authenticated." }] });
};

module.exports = {
  isAuthenticated: isAuthenticated,
  isNotAuthenticated: isNotAuthenticated,
};
