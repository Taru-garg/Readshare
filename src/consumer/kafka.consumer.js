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
const nodemailer = require("nodemailer");

dotenv.config({ path: "../../config/config.env" });

const kafkaManager = KafkaManager.getInstance(
  "consumer",
  process.env.KAFKA_BROKER_1_HOST,
  process.env.KAFKA_BROKER_1_PORT,
  process.env.KAFKA_USERNAME,
  process.env.KAFKA_PASSWORD
);
const { get_db } = require("../../config/db");

const run = async () => {
  const mailTransport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.OUTLOOK_MAIL_USER,
      pass: process.env.OUTLOOK_MAIL_PASSWORD,
    },
  });

  mailTransport.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  await kafkaManager.connect();
  await kafkaManager.consumer.subscribe({
    topics: ["team-mail-invite"],
    fromBeginning: true,
  });

  await kafkaManager.consumer.run({
    eachMessage: async ({ topic, _, message }) => {
      switch (topic) {
        case "team-mail-invite":
          const mail = await invite(message);
          await mailTransport.sendMail(mail);

          break;
        default:
          console.log(`Unknown topic ${topic}`);
          break;
      }
    },
  });
};

get_db().then(run().catch((e) => console.error(`[consumer] ${e.message}`, e)));
