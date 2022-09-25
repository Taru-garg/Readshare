"use strict";
const User = require("../../../models/User");

module.exports = {
  getTeams: async function getTeams(req, res) {
    try {
      const teams = await User.findById(req.user.id, { _id: 0, teams: 1 });
      return res.status(200).json(teams);
    } catch (err) {
      return res.status(400).json({ errors: [{ msg: err }] });
    }
  },
};
