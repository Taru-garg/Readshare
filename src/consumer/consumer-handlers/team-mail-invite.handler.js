"use strict";
const nodemailer = require("nodemailer");
const { Invite } = require("../../../models/Invite");
const { v4: uuidv4 } = require("uuid");

async function invite(message) {
//   message = JSON.parse(message);
  console.log(message.value.toString());
  const inviteId = uuidv4();
  return ''
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
