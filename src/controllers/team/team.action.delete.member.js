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

  if (!isValidTeam) throw new Error("Team not found");

  const isValidMember = await Team.find(
    { email: userEmail },
    { teams: { $in: [mongoose.Types.ObjectId(teamId)] } }
  );

  if (!isValidMember) throw new Error("Member not found");

  /*
   * There are two components to removing a member from a team
   * first we need to remove the member from the team object in mongoDB
   * second we need to remove the team from the members object in mongoDB
   */
  try {
  } catch (err) {
  } finally {
  }
}
