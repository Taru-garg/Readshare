/*
 * TODO: {taru.garg} This file has gotten kinda big. So I probably need to refactor it a little
 * but I am not really sure as to how should I break it. So leaving it as is for now.
 */

"use strict";

const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { validateMembers } = require("./team.util");
const mongoose = require("mongoose");
const { invite } = require("../invite/invite.action.invite");
module.exports = {
  createTeam: createTeam,
};

async function createTeam(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name } = req.body;

    // check members in req.body and add admin
    let members = [];
    if (req.body.members) {
      const validationResult = await validateMembers(req.body.members);
      if (!validationResult.success) throw new Error(validationResult.errors);
      if (validationResult.results.includes(null)) throw new Error("Invalid members present in request");
      
      members = validationResult.results;
    }
    /*
     * Admin is added to the db by default hence no need to add it in members
     * This is done to avoid sending an email to the admin when a team is created
     * This should also be done in the frontend as well ( nothing like having too much security 😌)
     */
    members = members.filter((member) => member.toString() !== req.user.id);

    // check links in req.body
    const links = req.body.links ? req.body.links : [];

    const [team] = await Team.create(
      [
        {
          name: name,
          admin: req.user._id,
          members: [req.user._id],
          links: links,
        },
      ],
      { session }
    );
    /*
     *
     * FIXME: {taru.garg} .create returns an array of teams. But we need to return a single item.
     * use team[0] to get the team is a temporary solution. There ideally should be a better way to do this.
     * rememeber users aren't updated yet, only once they have accepted the invitation
     * will they be added to the team and also only then the user's teams be updated with this team
     * however we need to update the teams of admin
     *
     */
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { teams: team._id } },
      { $upsert: true }
    )
      .session(session)
      .exec();

    // send invitations to users ( email format ) offload this to a task runner
    if (members)  await invite(members, team, req.user._id);

    await session.commitTransaction();
    return res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    await session.endSession();
  }
}
