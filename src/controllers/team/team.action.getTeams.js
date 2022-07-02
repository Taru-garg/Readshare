const passport = require("passport");
const Team = require("../../../models/Team");
const User = require("../../../models/User");

module.exports = async function getTeams(req, res) {
  try {
    res.send("Hello World");
  } catch (err) {
    console.log(err);
  }
};
