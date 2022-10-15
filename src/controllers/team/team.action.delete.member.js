"use strict";

const mongoose = require("mongoose");
const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { isValidTeam, isAdmin, isUserInTeam } = require("./team.util");
const { emailToUserId } = require("../user/user.util");

module.exports = {
  removeMemberFromTeam: removeMemberFromTeam,
};

async function removeMemberFromTeam(req, res) {
  const { email, teamId } = req.body;

  const userId = await emailToUserId(email);

  try {
    await validationCheck(req.user.id, userId, teamId);

    /*
     * There are two components to removing a member from a team
     * first we need to remove the member from the team object in mongoDB
     * second we need to remove the team from the members object in mongoDB
     */

    await Team.findByIdAndUpdate(teamId, {
      $pull: { members: mongoose.Types.ObjectId(userId) },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { teams: mongoose.Types.ObjectId(teamId) },
    });

    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: err.message }] });
  }
}

async function validationCheck(requestorId, userId, teamId) {
  if (!(await isAdmin(requestorId, teamId)))
    throw new Error("Only admins can remove members from teams");

  await isValidTeam(teamId);

  if (!(await isUserInTeam(userId, teamId)))
    throw new Error("Member not found");

  if (await isAdmin(userId, teamId))
    throw new Error("Cannot leave team as admin");

  return;
}
