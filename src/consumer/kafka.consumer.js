"use strict";

/*
 *
 * TODO: {taru.garg} Write code for processing E-Mail verification requests
 * We currently use kafka for consuming messages and thus processing those
 * messages only for the purpose of sending E-mail invites for joining the team.
 * However, eventually it will be used for sending E-mail verification invites when
 * a user registers for the first time.
 *
 */
const dotenv = require("dotenv");
const KafkaManager = require("../../config/kafka");
const {invite, handleAccept} = require("./consumer-handlers/team-mail-invite.handler");

dotenv.config({ path: "../../config/config.env" });

const kafkaManager = KafkaManager.getInstance("consumer");

const run = async () => {
  const topic = "team-mail-invite";
  await kafkaManager.connect();
  await kafkaManager.consumer.subscribe({
    topics: [topic],
    fromBeginning: true,
  });
  await kafkaManager.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case "team-mail-invite":
          await invite(message);
          break;
        default:
          console.log(`Unknown topic ${topic}`);
          break;
      }
    },
  });
};

run().catch((e) => console.error(`[consumer] ${e.message}`, e));
