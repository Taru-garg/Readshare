"use strict";
const User = require("../../../models/User");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  getUserfromUserId: async (id) => {
    const user = await User.findById(id);
    return {
      email: user.email,
      username: user.username,
    };
  },
  buildMail: (invitee, inviter, teamName, uniqueLink, readShareSender) => {
    return {
      from: `"ReadShare - ${inviter.email}" ${readShareSender}`, // sender address (who sends)
      to: invitee.email,
      subject: `${inviter.username} invited you to join a team on ReadShare`,
      html: `<html>
          <body>
            <p>Hey ${invitee.username},</p>
            <p>${inviter.username} invited you to join a team named ${teamName} on ReadShare.</p>
            <p>To accept, click the link ${uniqueLink}. The link is only valid for 5 minutes.</p>
            <p>Readshare is an application built for sharing links across your team.</p>
            <p>Regards, ReadShare</p>
          </body>
        </html>`,
    };
  },
  getNewInvite: (host, port) => {
    const inviteId = uuidv4();
    const uniqueLink = `${host}:${port}/invite/${inviteId}`;
    return [inviteId, uniqueLink];
  },
};
