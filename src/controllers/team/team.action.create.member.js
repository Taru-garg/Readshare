"use strict";

const Team = require("../../../models/Team");
const { validateMembers, isAdmin } = require("./team.util");
const { invite } = require("../invite/invite.action.invite");
const mongoose = require("mongoose");

module.exports = {
  addMemberToTeam: addMemberToTeam,
};

async function addMemberToTeam(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teamId, emails } = req.body;
    const team = await Team.findById(teamId).session(session).exec();

    const validationResult = await validateMembers(emails);

    if (!validationResult.success)
      throw new Error(validationResult.errors);

    const usersToadd = validationResult.results;

    // validate team and user
    if (!team)
      throw new Error("Team not found");

    if (!(await isAdmin(req.user.id, teamId)))
      throw new Error("Not authorized to add members to team");

    if (usersToadd.includes(null))
      throw new Error("Invalid members in the list");

    await invite(usersToadd, team, req.user.id);

    await session.commitTransaction();
    return res.sendStatus(200);
    
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    session.endSession();
  }
}
