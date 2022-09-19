"use strict";
const { Schema, model } = require("mongoose");

const inviteSchema = new Schema(
  {
    sentTo: {
      index: true,
      type: Schema.Types.ObjectId,
      required: true,
      message: "Sent to required.",
    },
    associatedTeam: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    inviteId: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      expires: "4h",
      index: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = model("Invite", inviteSchema);
