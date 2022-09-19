"use strict";

const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { validateMembers, isAdmin } = require("./team.util");
const { invite } = require("../invite/invite.action.invite")
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
      return res.status(400).json(validationResult.errors);

    const usersToadd = validationResult.results;

    // validate team and user
    if (!team) {
      return res.status(400).json({ errors: [{ msg: "Team not found." }] });
    }

    if (!(await isAdmin(req.user.id, teamId))) {
      return res.status(400).json({ errors: [{ msg: "Not authorized." }] });
    }

    if (usersToadd.includes(null)) throw new Error("Invalid members in the list")

    // just send the invite request here and the rest is already handeled
    await invite(usersToadd, team, req.user._id);
    
    await session.commitTransaction();
    return res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    session.endSession();
  }
}
