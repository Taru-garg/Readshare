"use strict";

const User = require("../../../models/User");
const mongoose = require("mongoose");

module.exports = {
  emailToUserId: emailToUserId,
};

async function emailToUserId(email) {
  const res = await User.exists({ email: email });
  if (!res) {
    throw new Error("Couldn't find user");
  }
  return res._id.toString();
}
