"use strict";
const { getEmailfromId } = require("./consumer-handler-utils");
const nodemailer = require("nodemailer");
const { Invite } = require("../../../models/Invite");
const { v4: uuidv4 } = require("uuid");

async function invite(message) {
  const { team, user } = JSON.parse(message.value.toString());
  console.log(`[consumer] Received invite for team ${team} and user ${user}`);
  const inviteId = uuidv4();

  /*
   * Maybe would need to make it static
   */

  const email = await getEmailfromId(user);

  const transporter =  nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.OUTLOOK_MAIL_USER,
      pass: process.env.OUTLOOK_MAIL_PASSWORD,
    },
  });

  // setup e-mail data
  const mailOptions = {
    from: `"Our Code World " ${process.env.OUTLOOK_MAIL_USER}`, // sender address (who sends)
    to: `${email}`, // list of receivers (who receives)
    subject: "Hello", // Subject line
    text: "Hello world ", // plaintext body
    html: "<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js", // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    console.log("Message sent: " + info.response);
  });

  return "";
}

async function handleAccept(message) {
  // check if this is a valid invite
  // check if user is already in the team
  // add the user to the team
  // delete the invite
}

module.exports = {
  invite: invite,
  handleAccept: handleAccept,
};
