const Invite = require("../../../models/Invite");
const Team = require("../../../models/Team");
const User = require("../../../models/User");
const mongoose = require("mongoose");
const { isUserInTeam } = require("../team/team.util");

module.exports = {
  accept: async (req, res) => {
    const { id } = req.params;
    try {
      const invite = await Invite.findOne({ inviteId: id });

      // logic to check if the user is already in the team
      if (
        (await isUserInTeam(req.user.id, invite.associatedTeam)).length != 0
      ) {
        await invite.remove();
        return res.sendStatus(303);
      }

      const isThereATeam = await Team.exists({ _id: invite.associatedTeam });

      if (!isThereATeam) {
        invite.remove();
        return res.sendStatus(404);
      }

      await Team.findOneAndUpdate(
        { _id: invite.associatedTeam },
        { $addToSet: { members: invite.sentTo } },
        { upsert: true }
      ).exec();

      await User.findOneAndUpdate(
        { _id: invite.sentTo },
        { $addToSet: { teams: invite.associatedTeam } }
      ).exec();

      await invite.remove();
      return res.sendStatus(200);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },
};
