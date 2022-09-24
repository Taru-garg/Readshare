"use strict";
const KafkaManager = require("../../../config/kafka");

module.exports = {
  invite: async (members, team, inviter) => {
    const kafka = KafkaManager.getInstance();
    await kafka.connect();
    const res = await kafka.producer.send({
      topic: "team-mail-invite",
      messages: members.map((member) => ({
        value: JSON.stringify({
          team: team._id,
          userId: member,
          teamName: team.name,
          inviterId: inviter,
        }),
      })),
    });
    return res;
  },
};
