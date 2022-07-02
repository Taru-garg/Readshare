"use strict";
const Team = require("../../../models/Team");

module.exports = {
  deleteTeam: deleteTeam,
  removeMemberFromTeam: removeMemberFromTeam,
};

async function deleteTeam(req, res) {
  const { teamId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (team) {
      Team.deleteOne({ _id: team._id });
    } else {
      return res
        .status(401)
        .json({ errors: [{ msg: "Only admins can delete." }] });
    }
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: err.message }] });
  }
}

async function removeMemberFromTeam(req, res) {
  res.send("remove member from team");
}
