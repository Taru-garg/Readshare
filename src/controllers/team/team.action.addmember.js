"use strict";

const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { validateMember, isAdmin } = require("./team.util");
const mongoose = require("mongoose");

module.exports = {
  addMemberToTeam: addMemberToTeam,
};

async function addMemberToTeam(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { teamId, emails } = req.body;
    const team = Team.findById(teamId, { session });

    const validationResult = await validateMember(emails);
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

    if (usersToadd.includes(null)) {
      const nonExistentUsers = [];

      usersToadd.forEach((user, index) => {
        if (!user) nonExistentUsers.push(emails[index]);
      });

      return res.status(400).json({
        errors: [{ msg: "Invalid Users present.", unmapped: nonExistentUsers }],
      });
    }

    // Update team and user
    await Team.updateOne(
      { $addToSet: { members: { $each: usersToadd } } },
      { session }
    );

    await User.updateMany(
      { email: { $in: emails } },
      { $addToSet: { teams: teamId } },    { session }
    );
    
    await session.commitTransaction();
    return res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    session.endSession();
  }
}
