"use strict";
const {
  getUserfromUserId,
  buildMail,
  getNewInvite,
} = require("./consumer-handler-utils");
const Invite = require("../../../models/Invite");
const mongoose = require("mongoose");

module.exports = {
  invite: async (message) => {
    const { team, userId, teamName, inviterId } = JSON.parse(
      message.value.toString()
    );

    const [inviteId, uniqueLink] = getNewInvite(
      process.env.HOST,
      process.env.PORT
    );
    const [invitee, inviter] = await Promise.all([
      await getUserfromUserId(userId),
      await getUserfromUserId(inviterId),
    ]);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const invite = new Invite({
        sentTo: userId,
        associatedTeam: team,
        inviteId: inviteId,
      });

      // setup e-mail data
      const mail = buildMail(
        invitee,
        inviter,
        teamName,
        uniqueLink,
        process.env.OUTLOOK_MAIL_USER
      );

      console.log("Building mail...");

      await invite.save({ session });
      await session.commitTransaction();
      return mail;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  },
};
