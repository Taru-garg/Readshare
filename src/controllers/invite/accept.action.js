const Invite = require("../../../models/Invite");
const Team = require("../../../models/Team");
const mongoose = require("mongoose");

module.exports = {
  invite: async (req, res) => {
    const { id } = req.params;
    try {
      const invite = await Invite.findOne({ inviteId: id });
      console.log(invite);
      await Team.findOneAndUpdate(
        { _id: invite.associatedTeam },
        { $addToSet: { members: invite.sentTo } },
        { upsert: true }
      ).exec();
      await invite.remove();
      return res.status(200);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    } 
  },
};
