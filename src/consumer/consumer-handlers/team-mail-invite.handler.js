"use strict";
const { getUserfromUserId } = require("./consumer-handler-utils");
const nodemailer = require("nodemailer");
const Invite = require("../../../models/Invite");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

async function invite(message) {
  const { team, userId, teamName, inviterId } = JSON.parse(
    message.value.toString()
  );
  const inviteId = uuidv4();
  const uniqueLink = `${process.env.HOST}:${process.env.PORT}/invite/${inviteId}`;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invite = new Invite({
      sentTo: userId,
      associatedTeam: team,
      inviteId: inviteId,
    });

    const invitee = await getUserfromUserId(userId);
    const inviter = await getUserfromUserId(inviterId);

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.OUTLOOK_MAIL_USER,
        pass: process.env.OUTLOOK_MAIL_PASSWORD,
      },
    });

    // setup e-mail data
    const mailOptions = {
      from: `"ReadShare - ${inviter.email}" ${process.env.OUTLOOK_MAIL_USER}`, // sender address (who sends)
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
          </html>`
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
    await invite.save({ session });
    await session.commitTransaction();
    return "";
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
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
