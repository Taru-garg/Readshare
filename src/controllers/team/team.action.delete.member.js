"use strict";

const mongoose = require("mongoose");
const Team = require("../../../models/Team");

module.exports = {
  removeMemberFromTeam: removeMemberFromTeam,
};

async function removeMemberFromTeam(req, res) {
  const { userEmail, teamId } = req.body;

  const isValidTeam = await Team.exists({
    _id: mongoose.Types.ObjectId(teamId),
  });

  const isValidMember = await Team.find(
    { email: userEmail },
    { teams: { $in: [mongoose.Types.ObjectId(teamId)] } }
  );

  if (!isValidTeam) throw new Error("Team not found");
  if (!isValidMember) throw new Error("Member not found");

  try {
  } catch (err) {
  } finally {
  }
}
