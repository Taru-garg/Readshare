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
const {
  invite,
  handleAccept,
} = require("./consumer-handlers/team-mail-invite.handler");

dotenv.config({ path: "../../config/config.env" });

const kafkaManager = KafkaManager.getInstance(
  "consumer",
  process.env.KAFKA_BROKER_1_HOST,
  process.env.KAFKA_BROKER_1_PORT,
  process.env.KAFKA_USERNAME,
  process.env.KAFKA_PASSWORD
);

const run = async () => {
  const topic = "team-mail-invite";
  await kafkaManager.connect();
  await kafkaManager.consumer.subscribe({
    topics: [topic],
    fromBeginning: true,
  });
  /*
   * TODO: {taru.garg} Check if possible to use Promise.all() here
   */
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

process.on("exit", async () => {
  console.log("Disconnecting from kafka");
  await kafkaManager.consumer.disconnect();
});

run().catch((e) => console.error(`[consumer] ${e.message}`, e));
