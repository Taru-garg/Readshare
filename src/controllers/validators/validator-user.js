"use strict";

const { check, body } = require("express-validator");
const  User = require("../../../models/User");

const userValidatorLogin = () => {
  return [
    body("email").trim().isEmail().withMessage("Provide a Valid E-Mail"),
    check("password").not().isEmpty().withMessage("Must Provide a Password"),
  ];
};
const userValidatorRegister = () => {
  return [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Provide a Valid E-Mail")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });

        if (user) {
          throw new Error("User with this E-Mail already exists");
        }
      }),
    body("username")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 3, max: 20 })
      .withMessage("Provide a Valid Username")
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error("User with this Username already exists");
        }
      }),
    check("password").not()
      .isEmpty()
      .withMessage("Must Provide a Password"),
    check("password")
      .isStrongPassword()
      .withMessage("Provide strong Password."),
  ];
};

module.exports = {
  userValidatorLogin: userValidatorLogin,
  userValidatorRegister: userValidatorRegister,
};
