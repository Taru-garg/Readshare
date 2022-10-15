const Invite = require("../../../models/Invite");
const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { isUserInTeam, isValidTeam } = require("../team/team.util");

module.exports = {
  accept: async (req, res) => {
    const { id } = req.params;
    const invite = await Invite.findOne({ inviteId: id });

    try {
      await userAlreadyJoined(req.user.id, invite);
      await isValidTeam(invite.associatedTeam);
      await updateTeam(invite);
      await updateUser(invite);
      await invite.remove();
      return res.sendStatus(200);
    } catch (e) {
      await invite.remove();
      return res.status(400).json({ error: e.message });
    }
  },
};

async function updateTeam(invite) {
  await Team.findOneAndUpdate(
    { _id: invite.associatedTeam },
    { $addToSet: { members: invite.sentTo } },
    { upsert: true }
  ).exec();
  return;
}

async function updateUser(invite) {
  await User.findOneAndUpdate(
    { _id: invite.sentTo },
    { $addToSet: { teams: invite.associatedTeam } }
  ).exec();
  return;
}

async function userAlreadyJoined(userId, invite) {
  const res = await isUserInTeam(userId, invite.associatedTeam);
  if (res.length > 0) {
    throw new Error("Bad Invite, user already joined");
  }
  return;
}
