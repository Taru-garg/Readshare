"use strict";
const { Schema, model } = require("mongoose");

const inviteSchema = new Schema(
  {
    sentTo: {
      index: true,
      type: Schema.Types.ObjectId,
      required: true,
      message: "Email Required.",
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
    expiresAt: { type: Date, default: Date.now, index: { expires: "5m" } },
  },
  { timestamps: true }
);

module.exports = model("Invite", inviteSchema);
