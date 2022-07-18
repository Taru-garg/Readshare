"use strict";
const { get_db } = require("../../../config/db");
const User = require("../../../models/User");

module.exports = {
  getUserfromUserId: async (id) => {
    const db = await get_db();
    const user = await User.findById(id);
    return {
      email: user.email,
      username: user.username,
    };
  },
};
