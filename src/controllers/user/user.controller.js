"use strict";

const registerUser = require("./user.action.register");
const logoutUser = require("./user.action.logout");

module.exports = {
  register: registerUser,
  logout: logoutUser,
};
