"use strict";
const Team = require("../../../models/Team");
const User = require("../../../models/User");
const { isAdmin } = require("./team.util");
const mongoose = require("mongoose");

module.exports = {
  deleteTeam: deleteTeam,
};

async function deleteTeam(req, res) {
  /*
   * There are three cases to consider when deleting a team from the database
   * 1. We need to delete the team from the database
   * 2. We need to delete the team for all the users in the team ( in the user object )
   * 3. Finally, we need to invalidate all the invites for this team ( this has been handeled in the invites section)
   */
  const { id } = req.body;
  try {
    if (await isAdmin(req.user.id, id)) {
      const isExistingTeam = await Team.exists({
        _id: mongoose.Types.ObjectId(id),
      });
      if (!isExistingTeam) {
        return res
          .status(404)
          .json({ errors: [{ msg: "No such team exists" }] });
      }
      await Team.deleteOne({ _id: mongoose.Types.ObjectId(id) });
      await removeTeamFromUsers(id);
      return res.sendStatus(200);
    } else {
      return res
        .status(401)
        .json({ errors: [{ msg: "Failed to delete the team" }] });
    }
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: err.message }] });
  }
}

async function removeTeamFromUsers(teamId) {
  const res = await User.updateMany({
    $pull: { teams: mongoose.Types.ObjectId(teamId) },
  });
  return res;
}
