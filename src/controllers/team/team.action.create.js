"use strict";

const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { validateMembers } = require("./team.util");
const mongoose = require("mongoose");
const KafkaManager = require("../../../config/kafka");

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
      if (!validationResult.success)
        return res.status(400).json({ errors: validationResult.errors });
      if (null in validationResult.results)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid members present." }] });
      members = validationResult.results;
    }
    // Admin is added to the db by default hence no need to add it in members
    // This is done to avoid sending an email to the admin when a team is created
    // This should also be done in the frontend as well ( bothing like having too much security 😌)
    if (members.includes(req.user.id)) members.pop(req.user.id);

    // check links in req.body
    const links = req.body.links ? req.body.links : [];

    const team = await Team.create(
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

    // rememeber users aren't updated yet, only once they have accepted the invitation
    // will they be added to the team and also only then the user's teams be updated with this team
    // however we need to update the teams of admin
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { teams: team._id } },
      { $upsert: true }
    )
      .session(session)
      .exec();
    await session.commitTransaction();
    console.log(user);
    // send invitations to users ( email format ) offload this to a task runner
    if (members.length > 0) {
      const kafka = KafkaManager.getInstance();
      console.log("Sending invitation to users, might take a while");
      await kafka.send(
        "team-mail-invite",
        req.body.members.map((member) => ({ value: member }))
      );
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    await session.endSession();
  }
}
